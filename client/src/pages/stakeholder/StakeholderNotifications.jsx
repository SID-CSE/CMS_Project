import React from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import { authService } from "../../services/authService";
import { getNotifications } from "../../services/workflowService";

export default function StakeholderNotifications() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    let active = true;
    getNotifications(authService.getUserId())
      .then((nextNotifications) => {
        if (active) setNotifications(nextNotifications);
      })
      .catch(() => {
        if (active) setNotifications([]);
      });

    return () => {
      active = false;
    };
  }, []);

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
              {notifications.map((note) => (
                <div key={note.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">{note.title || note.type}</div>
                  <div className="mt-1 text-slate-600">{note.message}</div>
                </div>
              ))}
              {!notifications.length ? <p className="text-sm text-slate-500">No notifications yet.</p> : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


