import React from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import { adminAuditEvents } from "../../data/workflowData";

export default function AdminAuditLog() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Audit Log</h1>
            <p className="mt-2 text-sm text-slate-500">Immutable record of every action. Filter, search, and export ready.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-3">
              {adminAuditEvents.map((event) => (
                <div key={event.id} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">{event.actor} • {event.action}</p>
                    <p className="text-xs text-slate-400">{event.timestamp}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">Target: {event.target}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


