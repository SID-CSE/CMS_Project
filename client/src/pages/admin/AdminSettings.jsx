import React from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Organisation Settings</h1>
            <p className="mt-2 text-sm text-slate-500">Configure workspace-level integrations and policies.</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Integrations</h2>
              <p className="mt-2 text-sm text-slate-500">Figma, Slack, and webhook connectors.</p>
              <button className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">Configure</button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Security & Policy</h2>
              <p className="mt-2 text-sm text-slate-500">Access policy, retention, and export rules.</p>
              <button className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">Manage</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


