const STORAGE_KEYS = {
  admin: "contify_finance_admin",
  editor: "contify_finance_editor",
  stakeholder: "contify_finance_stakeholder",
};

const defaultState = {
  admin: {
    stats: { total_spent: "₹48,500", pending: "₹12,000", last_payment: "₹8,000" },
    transactions: [
      { id: "ad-1", kind: "pay", source: "stakeholder", to: "admin", date: "2026-04-01", description: "Campaign retainer payment", amount: 12000, status: "paid", method: "Direct", paid_amount: 12000 },
      { id: "ad-2", kind: "pay", source: "admin", to: "editor", date: "2026-04-02", description: "April editorial payout", amount: 8500, status: "paid", method: "Bank transfer", paid_amount: 8500 },
      { id: "ad-3", kind: "invoice", source: "admin", to: "stakeholder", date: "2026-04-03", description: "Pending platform invoice", amount: 12000, status: "pending", method: "Invoice", paid_amount: 0 },
    ],
    requests: [
      { id: "req-1", title: "Request from stakeholder", amount: 12000, from: "stakeholder", status: "pending" },
      { id: "req-2", title: "Editor payout approved", amount: 8500, from: "editor", status: "paid" },
    ],
    expenses: [
      { id: "exp-1", item: "Software tools", date: "2026-04-01", amount: 1800, category: "Operations", client_email: "ops@contify" },
      { id: "exp-2", item: "Freelance revision fee", date: "2026-04-02", amount: 2200, category: "Content", client_email: "editor@contify" },
    ],
    counterparties: [
      { id: 1, email: "editor@contify", name: "Editor Team" },
      { id: 2, email: "stakeholder@contify", name: "Stakeholder Desk" },
    ],
  },
  editor: {
    stats: { total_spent: "₹0.00", pending: "₹8,500", last_payment: "₹8,500" },
    transactions: [
      { id: "ed-1", kind: "earnings", source: "admin", to: "editor", date: "2026-04-02", description: "April editorial payout", amount: 8500, status: "paid", method: "Bank transfer", paid_amount: 8500 },
      { id: "ed-2", kind: "invoice", source: "editor", to: "admin", date: "2026-04-03", description: "Payout request for premium edits", amount: 3500, status: "pending", method: "Request", paid_amount: 0 },
    ],
    requests: [
      { id: "req-3", title: "Payout request", amount: 3500, from: "editor", status: "pending" },
      { id: "req-4", title: "Paid by admin", amount: 8500, from: "admin", status: "paid" },
    ],
    expenses: [
      { id: "exp-3", item: "Reference assets", date: "2026-04-02", amount: 900, category: "Research", client_email: "editor@contify" },
    ],
    counterparties: [
      { id: 1, email: "admin@contify", name: "Admin Desk" },
      { id: 2, email: "stakeholder@contify", name: "Stakeholder Desk" },
    ],
  },
  stakeholder: {
    stats: { total_spent: "₹12,000", pending: "₹12,000", last_payment: "₹12,000" },
    transactions: [
      { id: "st-1", kind: "pay", source: "stakeholder", to: "admin", date: "2026-04-01", description: "Campaign retainer payment", amount: 12000, status: "paid", method: "Direct", paid_amount: 12000 },
      { id: "st-2", kind: "invoice", source: "admin", to: "stakeholder", date: "2026-04-03", description: "Pending platform invoice", amount: 12000, status: "pending", method: "Invoice", paid_amount: 0 },
    ],
    requests: [
      { id: "req-5", title: "Pay admin request", amount: 12000, from: "admin", status: "pending" },
      { id: "req-6", title: "Direct payment received", amount: 12000, from: "stakeholder", status: "paid" },
    ],
    expenses: [],
    counterparties: [
      { id: 1, email: "admin@contify", name: "Admin Desk" },
    ],
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readState(role) {
  const key = STORAGE_KEYS[role];
  if (!key) return null;
  const raw = localStorage.getItem(key);
  if (!raw) {
    const seed = clone(defaultState[role]);
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return { ...clone(defaultState[role]), ...JSON.parse(raw) };
  } catch {
    const seed = clone(defaultState[role]);
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
}

function writeState(role, state) {
  const key = STORAGE_KEYS[role];
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(state));
}

export function getFinanceState(role) {
  return readState(role);
}

export function saveFinanceState(role, state) {
  writeState(role, state);
}

export function createFinanceTransaction(role, transaction) {
  const state = readState(role);
  const next = {
    ...state,
    transactions: [
      {
        id: `${role}-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        status: transaction.status || "pending",
        method: transaction.method || "Direct",
        paid_amount: Number(transaction.paid_amount || 0),
        ...transaction,
      },
      ...(state.transactions || []),
    ],
  };

  if (typeof transaction.amount !== "undefined") {
    next.stats = {
      ...state.stats,
      total_spent: state.stats?.total_spent || "₹0.00",
      pending: state.stats?.pending || "₹0.00",
      last_payment: transaction.status === "paid" ? `₹${transaction.amount}` : state.stats?.last_payment || "₹0.00",
    };
  }

  writeState(role, next);
  return next;
}

export function updateFinanceRequest(role, requestId, patch) {
  const state = readState(role);
  const next = {
    ...state,
    requests: (state.requests || []).map((request) => (request.id === requestId ? { ...request, ...patch } : request)),
  };
  writeState(role, next);
  return next;
}

export function recordFinanceAction(role, transactionId, patch) {
  const state = readState(role);
  const next = {
    ...state,
    transactions: (state.transactions || []).map((transaction) =>
      transaction.id === transactionId ? { ...transaction, ...patch } : transaction
    ),
  };
  writeState(role, next);
  return next;
}
