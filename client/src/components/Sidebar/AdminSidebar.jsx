import React from "react";
import { Link, useLocation } from "react-router-dom";

const mainItems = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Projects", to: "/admin/projects" },
  { label: "Project detail", to: "/admin/projects" },
  { label: "Messages", to: "/admin/messages" },
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Audit log", to: "/admin/audit-log" },
  { label: "Settings", to: "/admin/settings" },
  { label: "Profile", to: "/admin/profile" },
  { label: "Finance", to: "/admin/finance" },
  { label: "Users", to: "/admin/users" },
  { label: "Content board", to: "/admin/content" },
  { label: "Streaming", to: "/admin/streaming" },
];

function isItemActive(location, to) {
  const [pathname, hash] = to.split("#");
  return hash
    ? location.pathname === pathname && location.hash === `#${hash}`
    : location.pathname === to;
}

export default function AdminSidebar({ width = 280, open = true, onClose }) {
  const location = useLocation();

  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-950/60 transition lg:hidden ${open ? "block" : "hidden"}`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width }}
      >
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-lg font-bold text-blue-300">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Contify</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin portal</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-6 overflow-y-auto pr-1">
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Manage content
            </p>
            <div className="mt-2 space-y-2">
              {mainItems.map((item) => {
                const active = isItemActive(location, item.to);

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-white" : "bg-slate-600"}`} />
                  </Link>
                );
              })}
            </div>
          </div>

        </nav>

        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-sm font-medium text-white">Publishing status</p>
          <p className="mt-2 text-sm text-slate-300">3 projects ready to publish, 7 items waiting for review.</p>
        </div>
      </aside>
    </>
  );
}
