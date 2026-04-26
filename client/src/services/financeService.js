import apiClient from './apiClient';

function formatCurrency(amount) {
  const value = Number(amount || 0);
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function formatDate(dateLike) {
  if (!dateLike) return '-';
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toISOString().slice(0, 10);
}

function normalizeStatus(status) {
  const value = (status || '').toString().trim().toUpperCase();
  if (value === 'PAID' || value === 'DISTRIBUTED') return 'paid';
  return 'pending';
}

const EMPTY_STATE = {
  stats: { total_spent: '₹0', pending: '₹0', last_payment: '₹0' },
  transactions: [],
  requests: [],
  expenses: [],
  counterparties: [],
};

function mapRequestToTransaction(request) {
  const amount = Number(request?.totalAmount || 0);
  return {
    id: request?.id,
    date: formatDate(request?.createdAt),
    description: request?.note || request?.projectTitle || 'Finance request',
    to: request?.stakeholderName || request?.projectTitle || '-',
    amount,
    status: normalizeStatus(request?.status),
    method: 'Invoice',
    paid_amount: normalizeStatus(request?.status) === 'paid' ? amount : 0,
  };
}

function buildStats(requests) {
  const items = Array.isArray(requests) ? requests : [];
  const total = items.reduce((sum, request) => sum + Number(request?.totalAmount || 0), 0);
  const pending = items
    .filter((request) => normalizeStatus(request?.status) !== 'paid')
    .reduce((sum, request) => sum + Number(request?.totalAmount || 0), 0);
  const paidItems = items
    .filter((request) => normalizeStatus(request?.status) === 'paid')
    .sort((a, b) => new Date(b?.paidAt || b?.distributedAt || 0) - new Date(a?.paidAt || a?.distributedAt || 0));
  const last = paidItems.length > 0 ? Number(paidItems[0]?.totalAmount || 0) : 0;

  return {
    total_spent: formatCurrency(total),
    pending: formatCurrency(pending),
    last_payment: formatCurrency(last),
  };
}

function mapRequestsForCards(requests) {
  return (requests || []).map((request) => ({
    id: request.id,
    title: request.projectTitle || 'Project request',
    amount: Number(request.totalAmount || 0),
    from: request.stakeholderName || '-',
    status: normalizeStatus(request.status),
    projectId: request.projectId,
  }));
}

function mapProjectsAsCounterparties(projects) {
  return (projects || []).map((project) => ({
    id: project.projectId,
    email: project.projectId,
    name: `${project.projectTitle} (${project.latestFinanceStatus || 'NONE'})`,
  }));
}

export async function getStakeholderFinanceRequests() {
  const response = await apiClient.get('/stakeholder/finance/requests');
  return response.data || [];
}

export async function getFinanceState(role) {
  if (!role) {
    return EMPTY_STATE;
  }

  if (role === 'admin') {
    const [projectsRes, requestsRes] = await Promise.all([
      apiClient.get('/admin/finance/projects'),
      apiClient.get('/admin/finance/requests'),
    ]);
    const requests = requestsRes.data || [];
    const projects = projectsRes.data || [];
    return {
      stats: buildStats(requests),
      transactions: requests.map(mapRequestToTransaction),
      requests: mapRequestsForCards(requests),
      expenses: [],
      counterparties: mapProjectsAsCounterparties(projects),
    };
  }

  if (role === 'stakeholder') {
    const requests = await getStakeholderFinanceRequests();
    return {
      stats: buildStats(requests),
      transactions: requests.map(mapRequestToTransaction),
      requests: mapRequestsForCards(requests),
      expenses: [],
      counterparties: [],
    };
  }

  if (role === 'editor') {
    const response = await apiClient.get('/editor/finance/payouts');
    const payouts = response.data || [];
    const pendingTotal = payouts
      .filter((entry) => normalizeStatus(entry.status) !== 'paid')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const paidEntries = payouts
      .filter((entry) => normalizeStatus(entry.status) === 'paid')
      .sort((a, b) => new Date(b?.paidAt || 0) - new Date(a?.paidAt || 0));
    const lastPaid = paidEntries.length > 0 ? Number(paidEntries[0].amount || 0) : 0;

    return {
      stats: {
        total_spent: formatCurrency(0),
        pending: formatCurrency(pendingTotal),
        last_payment: formatCurrency(lastPaid),
      },
      transactions: payouts.map((entry) => ({
        id: entry.id,
        date: formatDate(entry.createdAt),
        description: `Payout (${entry.recipientType || 'EDITOR'})`,
        to: entry.recipientName || '-',
        amount: Number(entry.amount || 0),
        status: normalizeStatus(entry.status),
        method: 'Bank transfer',
        paid_amount: normalizeStatus(entry.status) === 'paid' ? Number(entry.amount || 0) : 0,
      })),
      requests: [],
      expenses: [],
      counterparties: [],
    };
  }

  return EMPTY_STATE;
}

export async function saveFinanceState(role, state) {
  return state;
}

export async function createFinanceTransaction(role, transaction) {
  if (role !== 'admin') {
    return getFinanceState(role);
  }

  const projectId = transaction.to;
  if (!projectId) {
    throw new Error('Project is required to create finance request');
  }

  const totalAmount = Number(transaction.amount || 0);
  if (!(totalAmount > 0)) {
    throw new Error('Amount must be greater than zero');
  }

  const companyProfitAmount = Number(transaction.companyProfitAmount || (totalAmount * 0.2));

  await apiClient.post(`/admin/projects/${projectId}/finance-requests`, {
    totalAmount,
    companyProfitAmount,
    note: transaction.description || '',
  });

  return getFinanceState(role);
}

export async function updateFinanceRequest(role, requestId, patch) {
  if (!requestId) {
    throw new Error('Request id is required');
  }

  if (role === 'stakeholder' && patch?.status === 'paid') {
    await apiClient.patch(`/stakeholder/finance-requests/${requestId}/pay`, {});
    return getFinanceState(role);
  }

  if (role === 'admin' && patch?.status === 'paid') {
    await apiClient.patch(`/admin/finance-requests/${requestId}/distribute`, {});
    return getFinanceState(role);
  }

  return getFinanceState(role);
}

export async function recordFinanceAction(role, transactionId, patch) {
  return updateFinanceRequest(role, transactionId, patch);
}

export async function getFinanceCycle(role) {
  if (!role) {
    return { periods: [], currentPeriod: null, status: 'inactive' };
  }

  try {
    const response = await apiClient.get(`/${role}/finance/cycle`);
    return response?.data || { periods: [], currentPeriod: null, status: 'inactive' };
  } catch (error) {
    return { periods: [], currentPeriod: null, status: 'inactive' };
  }
}

export async function getFinanceCycleTransactions(role, cycleId) {
  if (!role || !cycleId) {
    return [];
  }

  try {
    const response = await apiClient.get(`/${role}/finance/cycles/${cycleId}/transactions`);
    return Array.isArray(response) ? response : response?.data || [];
  } catch (error) {
    return [];
  }
}

export async function createFinanceCycle(role, cycleData) {
  if (!role) {
    throw new Error('Role is required');
  }

  try {
    const response = await apiClient.post(`/${role}/finance/cycles`, cycleData);
    return response?.data || cycleData;
  } catch (error) {
    throw new Error(error.message || 'Failed to create finance cycle');
  }
}

export async function closeCycle(role, cycleId) {
  if (!role || !cycleId) {
    throw new Error('Role and cycle ID are required');
  }

  try {
    const response = await apiClient.patch(`/${role}/finance/cycles/${cycleId}/close`, {});
    return response?.data || { status: 'closed' };
  } catch (error) {
    throw new Error(error.message || 'Failed to close finance cycle');
  }
}
