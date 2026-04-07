import React from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import projectService from "../../services/projectService";

export default function AdminProjects() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      const result = await projectService.getNewProjectRequests();
      if (result.ok) {
        setProjects(result.data || []);
      } else {
        setError(result.message || "Failed to load project requests");
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Projects Manager</h1>
                <p className="mt-2 text-sm text-slate-500">Review requests, build plans, assign tasks, and approve submissions.</p>
              </div>
              <button onClick={() => window.location.reload()} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Refresh</button>
            </div>
          </section>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading requests...</div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">No new project requests right now.</div>
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{project.id}</p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{project.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{project.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{project.status}</span>
                    <Link to={`/admin/projects/${project.id}`} className="text-sm font-medium text-blue-600">Open</Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}


