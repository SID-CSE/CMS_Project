import React from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import { stakeholderNotifications } from "../../data/workflowData";

export default function StakeholderNotifications() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
            <p className="mt-2 text-sm text-slate-500">Only approval-ready content alerts are shown for stakeholders.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-2">
              {stakeholderNotifications.map((note) => (
                <div key={note} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{note}</div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


