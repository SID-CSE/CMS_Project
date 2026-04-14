import React from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import { useAuth } from "../../context/AuthContext";
import projectService from "../../services/projectService";
import { getStakeholderFinanceRequests } from "../../services/financeService";

export default function StakeholderProjects() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { userId } = useAuth();

  const [projects, setProjects] = React.useState([]);
  const [expandedProject, setExpandedProject] = React.useState(null);
  const [projectTasks, setProjectTasks] = React.useState({});
  const [projectRequests, setProjectRequests] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [submittingTaskReview, setSubmittingTaskReview] = React.useState({});
  const [submittingProjectReview, setSubmittingProjectReview] = React.useState({});
  const [taskReviewDrafts, setTaskReviewDrafts] = React.useState({});
  const [projectReviewDrafts, setProjectReviewDrafts] = React.useState({});
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const load = React.useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError("");
    setMessage("");

    const projectsResult = await projectService.getClientProjects(userId);

    if (!projectsResult.ok) {
      setError(projectsResult.message || "Failed to load projects");
      setLoading(false);
      return;
    }

    const allProjects = projectsResult.data || [];
    setProjects(allProjects);

    const taskResults = await Promise.all(
      allProjects.map((project) => projectService.getStakeholderProjectTasks(project.id, userId))
    );

    setProjectTasks((prev) => {
      const nextTaskMap = { ...prev };
      allProjects.forEach((project, index) => {
        if (taskResults[index].ok) {
          nextTaskMap[project.id] = taskResults[index].data || [];
        }
      });
      return nextTaskMap;
    });

    const groupedRequests = {};
    let financeRequests = [];
    try {
      financeRequests = await getStakeholderFinanceRequests();
    } catch {
      financeRequests = [];
    }
    for (const project of allProjects) {
      groupedRequests[project.id] = financeRequests.filter((req) => !req.projectId || req.projectId === project.id);
    }
    setProjectRequests(groupedRequests);

    setLoading(false);
  }, [userId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleExpandProject = async (projectId) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
    }
  };

  const handleTaskReviewSubmit = async (taskId) => {
    const draft = taskReviewDrafts[taskId] || { rating: 5, review: "" };
    setSubmittingTaskReview((prev) => ({ ...prev, [taskId]: true }));
    setError("");
    setMessage("");

    const result = await projectService.reviewStakeholderTask(taskId, userId, {
      rating: Number(draft.rating),
      review: draft.review || "",
    });

    if (result.ok) {
      setMessage("Task review saved successfully.");
      await load();
    } else {
      setError(result.message || "Failed to submit task review");
    }

    setSubmittingTaskReview((prev) => ({ ...prev, [taskId]: false }));
  };

  const handleProjectSignOff = async (projectId) => {
    const draft = projectReviewDrafts[projectId] || { rating: 5, feedback: "" };
    setSubmittingProjectReview((prev) => ({ ...prev, [projectId]: true }));
    setError("");
    setMessage("");

    const result = await projectService.signOffDelivery(projectId, userId, {
      rating: Number(draft.rating),
      feedback: draft.feedback || "",
    });

    if (result.ok) {
      setMessage("Project completion feedback submitted and project signed off.");
      await load();
    } else {
      setError(result.message || "Failed to complete project");
    }

    setSubmittingProjectReview((prev) => ({ ...prev, [projectId]: false }));
  };

  const getStatusColor = (status) => {
    const colors = {
      ASSIGNED: "bg-blue-50 text-blue-700",
      IN_PROGRESS: "bg-yellow-50 text-yellow-700",
      SUBMITTED: "bg-purple-50 text-purple-700",
      NEEDS_REVISION: "bg-orange-50 text-orange-700",
      APPROVED: "bg-green-50 text-green-700",
    };
    return colors[status] || "bg-slate-50 text-slate-700";
  };

  const getFinanceStatusColor = (status) => {
    const colors = {
      SENT: "bg-blue-50 text-blue-700",
      PAID: "bg-yellow-50 text-yellow-700",
      DISTRIBUTED: "bg-green-50 text-green-700",
    };
    return colors[status] || "bg-slate-50 text-slate-700";
  };

  const getCompletionPercentage = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const approved = tasks.filter((t) => t.status === "APPROVED").length;
    return Math.round((approved / tasks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">My Projects</h1>
                <p className="mt-2 text-sm text-slate-500">Minimal project view with progress, task reviews, and final project feedback.</p>
              </div>
              <button onClick={load} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Refresh</button>
            </div>
          </section>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {message && <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">No projects assigned to you yet.</div>
          ) : (
            <section className="space-y-4">
              {projects.map((project) => {
                const tasks = projectTasks[project.id] || [];
                const requests = projectRequests[project.id] || [];
                const completion = getCompletionPercentage(tasks);
                const allTasksApproved = tasks.length > 0 && tasks.every((task) => task.status === "APPROVED");

                return (
                  <article key={project.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <button
                      onClick={() => handleExpandProject(project.id)}
                      className="w-full p-6 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Project {project.id}</p>
                        <h2 className="mt-1 text-lg font-semibold text-slate-900">{project.title}</h2>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex-1 max-w-xs">
                            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full bg-green-500 transition-all"
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-slate-700">{completion}%</span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{project.status}</span>
                        <svg
                          className={`w-5 h-5 transition-transform text-slate-400 ${expandedProject === project.id ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </button>

                    {expandedProject === project.id && (
                      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Tasks</h3>
                            {tasks.length === 0 ? (
                              <p className="text-sm text-slate-500">No tasks yet.</p>
                            ) : (
                              <div className="space-y-3">
                                {tasks.map((task) => {
                                  const draft = taskReviewDrafts[task.id] || { rating: 5, review: "" };
                                  const canReview = Boolean(task.latestSubmission?.stakeholderVisible);
                                  return (
                                    <div key={task.id} className="rounded-lg border border-slate-200 bg-white p-4">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-slate-900">{task.title}</h4>
                                          <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                                          {task.latestSubmission?.submittedAt && (
                                            <p className="mt-2 text-xs text-slate-500">Streamed: {new Date(task.latestSubmission.submittedAt).toLocaleDateString()}</p>
                                          )}
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${getStatusColor(task.status)}`}>
                                          {task.status?.replace(/_/g, " ")}
                                        </span>
                                      </div>

                                      {canReview && (
                                        <div className="mt-4 border-t border-slate-100 pt-4">
                                          {task.latestSubmission?.stakeholderRating ? (
                                            <p className="text-xs text-slate-600">
                                              Rated {task.latestSubmission.stakeholderRating}/5
                                              {task.latestSubmission.stakeholderReview ? ` - ${task.latestSubmission.stakeholderReview}` : ""}
                                            </p>
                                          ) : (
                                            <div className="space-y-2">
                                              <div className="flex gap-2 items-center">
                                                <label className="text-xs font-medium text-slate-700">Rate</label>
                                                <select
                                                  value={draft.rating}
                                                  onChange={(e) => setTaskReviewDrafts((prev) => ({ ...prev, [task.id]: { ...draft, rating: e.target.value } }))}
                                                  className="rounded-md border border-slate-200 px-2 py-1 text-xs"
                                                >
                                                  <option value={5}>5</option>
                                                  <option value={4}>4</option>
                                                  <option value={3}>3</option>
                                                  <option value={2}>2</option>
                                                  <option value={1}>1</option>
                                                </select>
                                              </div>
                                              <textarea
                                                value={draft.review}
                                                onChange={(e) => setTaskReviewDrafts((prev) => ({ ...prev, [task.id]: { ...draft, review: e.target.value } }))}
                                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs"
                                                rows={2}
                                                placeholder="Task review (optional)"
                                              />
                                              <button
                                                onClick={() => handleTaskReviewSubmit(task.id)}
                                                disabled={submittingTaskReview[task.id]}
                                                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                                              >
                                                {submittingTaskReview[task.id] ? "Saving..." : "Submit Task Review"}
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {requests.length > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold text-slate-700 mb-4">Finance Requests</h3>
                              <div className="space-y-2">
                                {requests.map((req) => (
                                  <div key={req.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                                    <div className="flex justify-between">
                                      <span>Total: ${Number(req.totalAmount || 0).toFixed(2)}</span>
                                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getFinanceStatusColor(req.status)}`}>{req.status}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <h3 className="text-sm font-semibold text-slate-800">Final Project Feedback</h3>
                            <p className="mt-1 text-xs text-slate-500">Project can be completed only when every task is approved.</p>

                            {project.stakeholderRating ? (
                              <p className="mt-3 text-sm text-slate-700">
                                Final rating: {project.stakeholderRating}/5
                                {project.stakeholderFeedback ? ` - ${project.stakeholderFeedback}` : ""}
                              </p>
                            ) : (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <label className="text-xs font-medium text-slate-700">Rating</label>
                                  <select
                                    value={(projectReviewDrafts[project.id] || { rating: 5 }).rating}
                                    onChange={(e) => setProjectReviewDrafts((prev) => ({
                                      ...prev,
                                      [project.id]: { ...(prev[project.id] || { feedback: "" }), rating: e.target.value },
                                    }))}
                                    className="rounded-md border border-slate-200 px-2 py-1 text-xs"
                                  >
                                    <option value={5}>5</option>
                                    <option value={4}>4</option>
                                    <option value={3}>3</option>
                                    <option value={2}>2</option>
                                    <option value={1}>1</option>
                                  </select>
                                </div>
                                <textarea
                                  value={(projectReviewDrafts[project.id] || { feedback: "" }).feedback || ""}
                                  onChange={(e) => setProjectReviewDrafts((prev) => ({
                                    ...prev,
                                    [project.id]: { ...(prev[project.id] || { rating: 5 }), feedback: e.target.value },
                                  }))}
                                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs"
                                  rows={2}
                                  placeholder="What can we improve next time?"
                                />
                                <button
                                  onClick={() => handleProjectSignOff(project.id)}
                                  disabled={!allTasksApproved || submittingProjectReview[project.id]}
                                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                                >
                                  {submittingProjectReview[project.id] ? "Completing..." : "Complete Project"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
