import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const icons = {
  wallet: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
      <path d="M18 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-8h-4z" />
    </svg>
  ),
  invoice: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  trendUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  plus: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

function StatCard({ label, value, note, accent = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${colors[accent]}`}>{icons.wallet}</span>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      <p className="mt-2 text-sm text-slate-500">{note}</p>
    </div>
  );
}

function Badge({ children, tone = "slate" }) {
  const styles = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[tone]}`}>{children}</span>;
}

export default function RoleFinancePage({
  roleLabel,
  basePath,
  roleKey,
  state,
  onCreateTransaction,
  onUpdateRequest,
  onRecordAction,
  primaryActionLabel,
  primaryActionHint,
  counterparties = [],
  allowCreate = true,
  cycle = null,
  onCloseCycle = null,
}) {
  const [selectedCounterparty, setSelectedCounterparty] = useState(counterparties[0]?.email || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("Direct");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [distributionDrafts, setDistributionDrafts] = useState({});

  const stats = state.stats || {};
  const transactions = state.transactions || [];
  const requests = state.requests || [];
  const expenses = state.expenses || [];

  const summaryCards = useMemo(() => {
    return [
      { label: "Total Spent", value: stats.total_spent || "₹0.00", note: primaryActionHint, accent: "blue" },
      { label: "Pending", value: stats.pending || "₹0.00", note: "Pending settlements and invoices", accent: "amber" },
      { label: "Last Payment", value: stats.last_payment || "—", note: "Most recent recorded amount", accent: "emerald" },
      { label: "Open Requests", value: String(requests.filter((item) => item.status === "pending").length), note: "Awaiting action", accent: "violet" },
    ];
  }, [stats, requests, primaryActionHint]);

  const dashboardPath = useMemo(() => {
    if (roleKey === "stakeholder") return "/stakeholder/home";
    return `${basePath}/dashboard`;
  }, [basePath, roleKey]);

  const selectedAmount = Number(amount || 0);
  const canCreate = allowCreate && selectedAmount > 0 && selectedCounterparty;

  const handleCreate = async () => {
    setError("");
    setSuccess("");
    if (!allowCreate) return;
    if (!selectedCounterparty) {
      setError("Select a counterparty before creating a transaction.");
      return;
    }
    if (!(selectedAmount > 0)) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setBusy(true);
    try {
      await onCreateTransaction?.({
        to: selectedCounterparty,
        amount: selectedAmount,
        description: description || primaryActionLabel,
        method,
        status: roleKey === "stakeholder" ? "paid" : "pending",
        paid_amount: roleKey === "stakeholder" ? selectedAmount : 0,
      });
      setAmount("");
      setDescription("");
      setSuccess("Finance request created successfully.");
    } catch (createError) {
      setError(createError?.message || "Failed to create transaction.");
    } finally {
      setBusy(false);
    }
  };

  const handleRequestAction = async (requestId, patch) => {
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      await onUpdateRequest?.(requestId, patch);
      setSuccess("Finance request updated.");
    } catch (updateError) {
      setError(updateError?.message || "Failed to update request.");
    } finally {
      setBusy(false);
    }
  };

  const getDraft = (request) => {
    const existing = distributionDrafts[request.id];
    if (existing) return existing;
    return {
      companyProfitAmount: String(request.companyProfitAmount ?? 0),
      selectedRecipientId: request.eligibleRecipients?.[0]?.id || "",
      selectedAmount: "",
      shares: {},
    };
  };

  const setDraft = (requestId, nextDraft) => {
    setDistributionDrafts((prev) => ({ ...prev, [requestId]: nextDraft }));
  };

  const addShareToDraft = (request) => {
    const draft = getDraft(request);
    const amountNumber = Number(draft.selectedAmount || 0);
    if (!draft.selectedRecipientId) {
      setError("Select an employee before adding a share.");
      return;
    }
    if (!(amountNumber > 0)) {
      setError("Share amount must be greater than zero.");
      return;
    }
    setError("");
    setDraft(request.id, {
      ...draft,
      shares: {
        ...draft.shares,
        [draft.selectedRecipientId]: amountNumber,
      },
      selectedAmount: "",
    });
  };

  const removeShareFromDraft = (requestId, recipientId) => {
    const draft = distributionDrafts[requestId];
    if (!draft) return;
    const nextShares = { ...draft.shares };
    delete nextShares[recipientId];
    setDraft(requestId, { ...draft, shares: nextShares });
  };

  const handleAdminDistribute = async (request) => {
    const draft = getDraft(request);
    const companyProfitAmount = Number(draft.companyProfitAmount || 0);
    const employeeShares = Object.entries(draft.shares || {}).map(([recipientUserId, amount]) => ({
      recipientUserId,
      amount: Number(amount),
    }));

    if (!(companyProfitAmount >= 0)) {
      setError("Company amount cannot be negative.");
      return;
    }

    if (!employeeShares.length) {
      setError("Add at least one employee payout before distribution.");
      return;
    }

    const sharesTotal = employeeShares.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expectedWorkerPool = Number(request.totalAmount || 0) - companyProfitAmount;
    if (Math.abs(sharesTotal - expectedWorkerPool) > 0.009) {
      setError(`Employee payout total must match worker pool (₹${expectedWorkerPool.toFixed(2)}).`);
      return;
    }

    await handleRequestAction(request.id, {
      status: "paid",
      companyProfitAmount,
      employeeShares,
    });
  };

  const exportTransactions = () => {
    const headers = ["date", "description", "counterparty", "amount", "status", "method"];
    const rows = transactions.map((tx) => [
      tx.date || "",
      tx.description || "",
      tx.to || tx.from || "",
      tx.amount || 0,
      tx.status || "",
      tx.method || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${roleKey}-finance-transactions.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{roleLabel} Finance</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Accounting & Finance</h1>
            <p className="mt-2 text-sm text-slate-500">
              Handle invoices, record payments, review requests, and keep transfers aligned with role-specific workflows.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={dashboardPath} className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Back to Dashboard
            </Link>
            {allowCreate ? (
              <button
                type="button"
                onClick={handleCreate}
                disabled={!canCreate || busy}
                className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="mr-2">{icons.plus}</span>
                {busy ? "Processing..." : primaryActionLabel}
              </button>
            ) : null}
          </div>
        </div>
        {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div> : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      {cycle ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Finance Cycle</h2>
              <p className="mt-1 text-sm text-slate-500">Track finances within the current cycle period</p>
            </div>
            {cycle.status === 'active' && onCloseCycle && (
              <button
                type="button"
                onClick={() => onCloseCycle?.(cycle.id)}
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close Cycle
              </button>
            )}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Period</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{cycle.period || 'Current'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 capitalize">{cycle.status || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Transactions</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{cycle.transactionCount || 0}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
              <p className="mt-1 text-sm text-slate-500">Payments, invoices, and transfers for {roleLabel.toLowerCase()}.</p>
            </div>
            <button
              type="button"
              onClick={exportTransactions}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {icons.download}
              Export report
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Counterparty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {!transactions.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">No transactions yet.</td>
                  </tr>
                ) : transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-3 text-sm text-slate-600">{tx.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{tx.description}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{tx.to || tx.from || "—"}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">₹{tx.amount}</td>
                    <td className="px-4 py-3 text-right text-sm"><Badge tone={tx.status === "paid" ? "emerald" : tx.status === "pending" ? "amber" : "slate"}>{tx.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{primaryActionLabel}</h2>
            <p className="mt-1 text-sm text-slate-500">{primaryActionHint}</p>

            {allowCreate ? (
              <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-slate-700">Counterparty</label>
              <select value={selectedCounterparty} onChange={(e) => setSelectedCounterparty(e.target.value)} className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 outline-none">
                {counterparties.map((counterparty) => (
                  <option key={counterparty.email} value={counterparty.email}>{counterparty.name} • {counterparty.email}</option>
                ))}
              </select>

              <label className="block text-sm font-medium text-slate-700">Amount</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 outline-none" placeholder="Enter amount" />

              <label className="block text-sm font-medium text-slate-700">Description</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 outline-none" placeholder="Add a note" />

              <label className="block text-sm font-medium text-slate-700">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-700 outline-none">
                <option>Direct</option>
                <option>Bank transfer</option>
                <option>Invoice</option>
                <option>Cash</option>
              </select>

                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!canCreate || busy}
                  className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? "Processing..." : primaryActionLabel}
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                This role cannot create direct transactions. Use the Requests section below to complete pending actions.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Requests</h2>
            <div className="mt-4 space-y-3">
              {!requests.length ? <p className="text-sm text-slate-500">No finance requests pending.</p> : requests.map((request) => (
                <div key={request.id} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{request.title}</p>
                      <p className="mt-1 text-sm text-slate-500">₹{request.amount}</p>
                    </div>
                    <Badge tone={request.status === "paid" ? "emerald" : "amber"}>{request.status}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {request.rawStatus === "PAID" && roleKey === "admin" && (
                      <div className="w-full space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Custom distribution</p>
                        <div className="grid gap-2 md:grid-cols-[1fr_150px_auto]">
                          <select
                            value={getDraft(request).selectedRecipientId}
                            onChange={(e) => setDraft(request.id, { ...getDraft(request), selectedRecipientId: e.target.value })}
                            className="h-10 rounded-lg border border-slate-300 px-3 text-xs text-slate-700"
                          >
                            <option value="">Select employee name</option>
                            {(request.eligibleRecipients || []).map((recipient) => {
                              const displayName = recipient.name || recipient.username || "Unnamed employee";
                              return (
                                <option key={recipient.id} value={recipient.id}>
                                  {displayName}
                                </option>
                              );
                            })}
                          </select>
                          <input
                            value={getDraft(request).selectedAmount}
                            onChange={(e) => setDraft(request.id, { ...getDraft(request), selectedAmount: e.target.value })}
                            placeholder="Amount"
                            className="h-10 rounded-lg border border-slate-300 px-3 text-xs text-slate-700"
                          />
                          <button
                            type="button"
                            onClick={() => addShareToDraft(request)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700"
                          >
                            Add
                          </button>
                        </div>

                        <label className="block text-xs font-medium text-slate-700">Company share</label>
                        <input
                          value={getDraft(request).companyProfitAmount}
                          onChange={(e) => setDraft(request.id, { ...getDraft(request), companyProfitAmount: e.target.value })}
                          className="h-10 w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-700"
                        />

                        <div className="space-y-1">
                          {Object.entries(getDraft(request).shares || {}).map(([recipientId, shareAmount]) => {
                            const recipient = (request.eligibleRecipients || []).find((item) => item.id === recipientId);
                            return (
                              <div key={recipientId} className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-700">
                                <span>{recipient?.name || recipient?.username || "Unnamed employee"} - ₹{Number(shareAmount).toFixed(2)}</span>
                                <button type="button" onClick={() => removeShareFromDraft(request.id, recipientId)} className="text-red-600">Remove</button>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={async () => handleAdminDistribute(request)}
                          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Distribute
                        </button>
                      </div>
                    )}
                    {request.rawStatus === "SENT" && roleKey === "stakeholder" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={async () => handleRequestAction(request.id, { status: "paid" })}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Pay Now
                      </button>
                    )}
                    {request.rawStatus === "SENT" && roleKey === "admin" ? (
                      <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                        Waiting for stakeholder payment
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Expenses</h2>
            <div className="mt-4 space-y-3">
              {!expenses.length ? <p className="text-sm text-slate-500">No expense entries yet.</p> : expenses.map((expense) => (
                <div key={expense.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{expense.item}</p>
                      <p className="mt-1 text-sm text-slate-500">{expense.category} • {expense.date}</p>
                    </div>
                    <p className="text-sm font-semibold text-red-600">- ₹{expense.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
