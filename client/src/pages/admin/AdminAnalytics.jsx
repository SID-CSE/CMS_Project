import React from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import apiClient from "../../services/apiClient";

export default function AdminAnalytics() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    let active = true;
    apiClient
      .get("/admin/tasks")
      .then((response) => {
        if (!active) return;
        const tasks = Array.isArray(response?.data) ? response.data : [];
        const submitted = tasks.filter((task) => task.status === "SUBMITTED").length;
        const approved = tasks.filter((task) => task.status === "APPROVED").length;
        const revision = tasks.filter((task) => task.status === "NEEDS_REVISION").length;
        const approvalRate = tasks.length ? `${Math.round((approved / tasks.length) * 100)}%` : "0%";

        setCards([
          { label: "Total Tasks", value: String(tasks.length), note: "Across all projects" },
          { label: "Pending Review", value: String(submitted), note: "Submitted and waiting" },
          { label: "Approval Rate", value: approvalRate, note: "Approved over total tasks" },
          { label: "Needs Revision", value: String(revision), note: "Returned for changes" },
        ]);
      })
      .catch(() => {
        if (active) setCards([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Analytics Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Organisation-wide cycle time, approval rates, and reviewer performance.</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
                <p className="mt-2 text-sm text-slate-500">{card.note}</p>
              </div>
            ))}
            {!cards.length ? <p className="text-sm text-slate-500">No analytics data available.</p> : null}
          </section>
        </div>
      </main>
    </div>
  );
}


