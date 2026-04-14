import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getRoleNavigation, isRoleRouteActive } from "./roleNavigationConfig";

export default function RoleSidebar({ role = "editor", width = 280, open = true, onClose, allowScroll = true }) {
  const location = useLocation();
  const config = getRoleNavigation(role);

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
              {config.initials}
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Contify</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{config.portalLabel}</p>
            </div>
          </div>
        </div>

        <nav className={`mt-8 flex-1 space-y-6 pr-1 ${allowScroll ? "overflow-y-auto" : "overflow-hidden"}`}>
          {config.sidebarSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{section.title}</p>
              <div className="mt-2 space-y-2">
                {section.items.map((item) => {
                  const active = isRoleRouteActive(location.pathname, item);

                  return (
                    <Link
                      key={`${section.title}-${item.to}`}
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
          ))}
        </nav>

        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="text-sm font-medium text-white">{config.statusTitle}</p>
          <p className="mt-2 text-sm text-slate-300">{config.statusText}</p>
        </div>
      </aside>
    </>
  );
}
