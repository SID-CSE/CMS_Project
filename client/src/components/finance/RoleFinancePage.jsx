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
}) {
  const [selectedCounterparty, setSelectedCounterparty] = useState(counterparties[0]?.email || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("Direct");
  const [requestNote, setRequestNote] = useState("");

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

  const handleCreate = async () => {
    if (!allowCreate) return;
    if (!amount || !selectedCounterparty) return;
    await onCreateTransaction?.({
      to: selectedCounterparty,
      amount: Number(amount),
      description: description || primaryActionLabel,
      method,
      status: roleKey === "stakeholder" ? "paid" : "pending",
      paid_amount: roleKey === "stakeholder" ? Number(amount) : 0,
    });
    setAmount("");
    setDescription("");
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
            <Link to={basePath} className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Back to Dashboard
            </Link>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!allowCreate}
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <span className="mr-2">{icons.plus}</span>
              {primaryActionLabel}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
              <p className="mt-1 text-sm text-slate-500">Payments, invoices, and transfers for {roleLabel.toLowerCase()}.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
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
                {transactions.map((tx) => (
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
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Requests</h2>
            <div className="mt-4 space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{request.title}</p>
                      <p className="mt-1 text-sm text-slate-500">₹{request.amount}</p>
                    </div>
                    <Badge tone={request.status === "paid" ? "emerald" : "amber"}>{request.status}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {request.status === "pending" && roleKey === "admin" && (
                      <button
                        type="button"
                        onClick={async () => onUpdateRequest?.(request.id, { status: "paid" })}
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                      >
                        Distribute
                      </button>
                    )}
                    {request.status === "pending" && roleKey === "stakeholder" && (
                      <button
                        type="button"
                        onClick={async () => onUpdateRequest?.(request.id, { status: "paid" })}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Expenses</h2>
            <div className="mt-4 space-y-3">
              {expenses.map((expense) => (
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
