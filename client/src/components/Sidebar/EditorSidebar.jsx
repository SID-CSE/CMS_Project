import React from "react";
import { Link, useLocation } from "react-router-dom";

const mainItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Projects", to: "/projects" },
  { label: "Project content", to: "/projects/pj-101/content" },
  { label: "Content viewer", to: "/content/ct-501/view" },
  { label: "Version history", to: "/content/ct-501/versions" },
  { label: "Notifications", to: "/notifications" },
  { label: "Messages", to: "/editor/messages" },
  { label: "Profile", to: "/editor/profile" },
  { label: "Finance", to: "/editor/finance" },
  { label: "My content", to: "/editor/content" },
  { label: "Streaming", to: "/editor/streaming" },
];

function isItemActive(location, to) {
  const [pathname, hash] = to.split("#");
  return hash
    ? location.pathname === pathname && location.hash === `#${hash}`
    : location.pathname === to;
}

export default function EditorSidebar({ width = 280, open = true, onClose }) {
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
              ED
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Contify</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Editor portal</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-6 overflow-y-auto pr-1">
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Content workflow
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
          <p className="text-sm font-medium text-white">Draft status</p>
          <p className="mt-2 text-sm text-slate-300">4 drafts in progress, 2 items waiting for review.</p>
        </div>
      </aside>
    </>
  );
}
