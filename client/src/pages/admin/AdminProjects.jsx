import React from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import projectService from "../../services/projectService";
import UserIdentityLink from "../../components/profile/UserIdentityLink";

const PROJECT_STATUSES = [
  { label: "Requested", value: "REQUESTED" },
  { label: "Plan Sent", value: "PLAN_SENT" },
  { label: "Ongoing", value: "IN_PROGRESS" },
  { label: "On Hold", value: "REVISION" },
  { label: "Rejected", value: "REVISION" },
  { label: "Completed", value: "SIGNED_OFF" },
  { label: "Delivered", value: "DELIVERED" },
];

const getTaskStatusColor = (status) => {
  const colors = {
    ASSIGNED: "bg-blue-50 text-blue-700",
    IN_PROGRESS: "bg-yellow-50 text-yellow-700",
    SUBMITTED: "bg-purple-50 text-purple-700",
    NEEDS_REVISION: "bg-orange-50 text-orange-700",
    APPROVED: "bg-green-50 text-green-700",
  };
  return colors[status] || "bg-slate-50 text-slate-700";
};

export default function AdminProjects() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { userId } = useAuth();
  const [projects, setProjects] = React.useState([]);
  const [expandedProject, setExpandedProject] = React.useState(null);
  const [projectTasks, setProjectTasks] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [taskLoading, setTaskLoading] = React.useState({});
  const [statusUpdating, setStatusUpdating] = React.useState({});
  const [error, setError] = React.useState("");

  const loadAllProjects = React.useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await projectService.getAllProjects();
    if (result.ok) {
      setProjects(result.data || []);
    } else {
      setError(result.message || "Failed to load projects");
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadAllProjects();
  }, [loadAllProjects]);

  const loadProjectTasks = async (projectId) => {
    if (projectTasks[projectId]) return;
    setTaskLoading((prev) => ({ ...prev, [projectId]: true }));
    const result = await projectService.getProjectTasksForAdmin(projectId);
    setProjectTasks((prev) => ({ ...prev, [projectId]: result.ok ? result.data || [] : [] }));
    setTaskLoading((prev) => ({ ...prev, [projectId]: false }));
  };

  const handleExpandProject = async (projectId) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
      return;
    }
    setExpandedProject(projectId);
    await loadProjectTasks(projectId);
  };

  const handleUpdateStatus = async (projectId, newStatus) => {
    setStatusUpdating((prev) => ({ ...prev, [projectId]: true }));
    setError("");
    const result = await projectService.updateProjectStatus(projectId, newStatus, userId);
    if (result.ok) {
      setProjects((prev) => prev.map((project) => (
        project.id === projectId ? { ...project, status: newStatus } : project
      )));
    } else {
      setError(result.message || "Failed to update project status");
    }
    setStatusUpdating((prev) => ({ ...prev, [projectId]: false }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]} />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">All Projects</h1>
                <p className="mt-2 text-sm text-slate-500">Manage all projects, view tasks, and update status.</p>
              </div>
              <button onClick={loadAllProjects} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Refresh</button>
            </div>
          </section>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">No projects yet.</div>
          ) : (
            <section className="space-y-4">
              {projects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <button
                    onClick={() => handleExpandProject(project.id)}
                    className="w-full p-6 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Project {project.id}</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">{project.title}</h2>
                      <p className="mt-2 line-clamp-1 text-sm text-slate-600">{project.description}</p>
                    </div>
                    <div className="ml-4 flex items-center gap-4">
                      <select
                        value={project.status}
                        onChange={(event) => handleUpdateStatus(project.id, event.target.value)}
                        onClick={(event) => event.stopPropagation()}
                        disabled={statusUpdating[project.id]}
                        className={`rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          statusUpdating[project.id] ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {PROJECT_STATUSES.map((status) => (
                          <option key={`${status.label}-${status.value}`} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </button>

                  {expandedProject === project.id && (
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                      {taskLoading[project.id] ? (
                        <p className="text-sm text-slate-500">Loading tasks...</p>
                      ) : projectTasks[project.id]?.length === 0 ? (
                        <p className="text-sm text-slate-500">No tasks assigned yet for this project.</p>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-slate-700 mb-4">Tasks</p>
                          {projectTasks[project.id]?.map((task) => (
                            <div key={task.id} className="rounded-lg border border-slate-200 bg-white p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-slate-900">{task.title}</h3>
                                  <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                    <span>Assigned Editor:</span>
                                    {task.assignedEditor?.id ? (
                                      <UserIdentityLink
                                        userId={task.assignedEditor.id}
                                        name={task.assignedEditor?.name || task.assignedEditor?.username}
                                        role={task.assignedEditor?.role}
                                        profileImage={task.assignedEditor?.profileImage}
                                        className="-ml-1"
                                      />
                                    ) : (
                                      <span>Not assigned</span>
                                    )}
                                  </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${getTaskStatusColor(task.status)}`}>
                                  {task.status?.replace(/_/g, " ")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}


