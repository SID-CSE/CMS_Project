import React, { useMemo, useState } from "react";

const columns = ["Draft", "In Progress", "In Review", "Approved", "Rejected"];

const statusStyles = {
  Draft: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-50 text-blue-700",
  "In Review": "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

function Badge({ children, tone = "slate" }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[tone] || statusStyles.Draft}`}>{children}</span>;
}

function formatTimestamp(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function ContentKanban({
  roleConfig,
  items,
  auditLog,
  onAdvance,
  onReject,
  onCreateDraft,
}) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [summary, setSummary] = useState("");

  const grouped = useMemo(() => {
    const map = { Draft: [], "In Progress": [], "In Review": [], Approved: [], Rejected: [] };
    (items || []).forEach((item) => {
      map[item.status] = map[item.status] || [];
      map[item.status].push(item);
    });
    return map;
  }, [items]);

  const handleCreate = () => {
    if (!title.trim() || !owner.trim()) return;
    onCreateDraft?.({ title: title.trim(), owner: owner.trim(), summary: summary.trim(), actor: roleConfig.roleLabel });
    setTitle("");
    setOwner("");
    setSummary("");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{roleConfig.roleLabel} Content</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Content Kanban Board</h1>
            <p className="mt-2 text-sm text-slate-500">
              One click moves content across Draft, In Progress, In Review, Approved, and Rejected. Every move is logged permanently.
            </p>
          </div>
          {roleConfig.canCreate && (
            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:min-w-[320px]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Create Draft</h2>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Content title" className="h-10 rounded-xl border border-slate-300 px-3 text-sm" />
              <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner" className="h-10 rounded-xl border border-slate-300 px-3 text-sm" />
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary" rows={3} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <button type="button" onClick={handleCreate} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Create Draft</button>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        {columns.map((status) => (
          <div key={status} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{status}</h2>
              <Badge tone={status}>{grouped[status]?.length || 0}</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {(grouped[status] || []).map((item) => {
                const nextStatus = roleConfig.nextStep[item.status];
                const isInReview = item.status === "In Review";
                const canAdvance = Boolean(nextStatus);
                return (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">{item.owner}</p>
                      </div>
                      <Badge tone={item.status}>{item.status}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{item.summary}</p>
                    <p className="mt-3 text-xs text-slate-400">Updated {formatTimestamp(item.updatedAt)}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {canAdvance && (
                        <button
                          type="button"
                          onClick={() => onAdvance?.(item)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white"
                        >
                          Move to {nextStatus}
                        </button>
                      )}
                      {isInReview && roleConfig.canReject && (
                        <button
                          type="button"
                          onClick={() => onReject?.(item)}
                          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Audit Log</h2>
        <p className="mt-1 text-sm text-slate-500">Permanent record of every content transition.</p>
        <div className="mt-4 space-y-3">
          {(auditLog || []).length ? (auditLog || []).map((entry) => (
            <div key={entry.id} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{entry.itemTitle}</p>
                  <p className="text-sm text-slate-600">{entry.message}</p>
                </div>
                <div className="text-xs text-slate-400">{formatTimestamp(entry.timestamp)}</div>
              </div>
            </div>
          )) : <p className="text-sm text-slate-500">No transitions yet.</p>}
        </div>
      </section>
    </div>
  );
}
