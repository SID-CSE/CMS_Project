import React from "react";
import { Link } from "react-router-dom";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import { useAuth } from "../../context/AuthContext";
import projectService from "../../services/projectService";

const getTaskStatusCounts = (tasks) => tasks.reduce((acc, task) => {
  const next = { ...acc };
  next.total += 1;
  next[task.status] = (next[task.status] || 0) + 1;
  if (task.status === "APPROVED") next.done += 1;
  return next;
}, {
  total: 0,
  done: 0,
  ASSIGNED: 0,
  IN_PROGRESS: 0,
  SUBMITTED: 0,
  NEEDS_REVISION: 0,
  APPROVED: 0,
});

export default function EditorProjects() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const { userId } = useAuth();

  const loadEditorProjects = React.useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");

    const result = await projectService.getEditorTasks(userId);
    if (!result.ok) {
      setProjects([]);
      setError(result.message || "Failed to load editor projects");
      setLoading(false);
      return;
    }

    const tasks = result.data || [];
    const grouped = tasks.reduce((acc, task) => {
      const id = task.projectId;
      if (!id) return acc;

      if (!acc[id]) {
        acc[id] = {
          id,
          title: task.projectTitle || `Project ${id}`,
          status: task.projectStatus || "IN_PROGRESS",
          tasks: [],
        };
      }

      acc[id].tasks.push(task);
      return acc;
    }, {});

    const normalized = Object.values(grouped).map((project) => ({
      ...project,
      stats: getTaskStatusCounts(project.tasks),
    }));

    setProjects(normalized);
    setLoading(false);
  }, [userId]);

  React.useEffect(() => {
    loadEditorProjects();
  }, [loadEditorProjects]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">My Projects</h1>
                <p className="mt-2 text-sm text-slate-500">Projects derived from your assigned backend tasks.</p>
              </div>
              <button onClick={loadEditorProjects} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Refresh</button>
            </div>
          </section>

          {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

          {loading ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading projects...</div>
          ) : (
            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{project.id}</p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{project.title}</h2>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p>Total Tasks: {project.stats.total}</p>
                    <p>Done: {project.stats.done}</p>
                    <p>Pending Review: {project.stats.SUBMITTED}</p>
                    <p>Needs Revision: {project.stats.NEEDS_REVISION}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{project.status}</span>
                    <Link to={`/projects/${project.id}/content`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Open content
                    </Link>
                  </div>
                </article>
              ))}
              {!projects.length ? <p className="text-sm text-slate-500">No projects assigned yet.</p> : null}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}


