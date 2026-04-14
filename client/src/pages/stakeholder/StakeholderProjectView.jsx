import React from "react";
import { useParams } from "react-router-dom";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import { useAuth } from "../../context/AuthContext";
import projectService from "../../services/projectService";
import CloudMediaViewer from "../../components/media/CloudMediaViewer";

export default function StakeholderProjectView() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { id } = useParams();
  const { userId } = useAuth();

  const [project, setProject] = React.useState(null);
  const [plan, setPlan] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [feedback, setFeedback] = React.useState("");

  const loadPage = React.useCallback(async () => {
    setLoading(true);
    setError("");

    const [projectResult, tasksResult, planResult] = await Promise.all([
      projectService.getProjectDetails(id, userId),
      projectService.getStakeholderProjectTasks(id, userId),
      projectService.getProjectPlan(id, userId),
    ]);

    if (projectResult.ok) {
      setProject(projectResult.data);
    } else {
      setError(projectResult.message || "Failed to load project");
    }

    if (tasksResult.ok) {
      setTasks(tasksResult.data || []);
    }

    if (planResult.ok) {
      setPlan(planResult.data || null);
    } else if ((planResult.message || "").toLowerCase().includes("plan not found")) {
      setPlan(null);
    }

    setLoading(false);
  }, [id, userId]);

  React.useEffect(() => {
    if (userId) {
      loadPage();
    }
  }, [userId, loadPage]);

  const canSignOff = project?.status === "DELIVERED";
  const canReviewProposal = project?.status === "PLAN_SENT";
  const latestPreview = tasks.find((task) => task.latestSubmission?.cdnUrl)?.latestSubmission;

  const handleAcceptPlan = async () => {
    setMessage("");
    setError("");
    const result = await projectService.acceptProjectPlan(id, userId);
    if (result.ok) {
      setMessage("Proposal accepted. Project is now in progress.");
      loadPage();
    } else {
      setError(result.message || "Failed to accept proposal");
    }
  };

  const handleRequestChange = async () => {
    setMessage("");
    setError("");
    if (!feedback.trim()) {
      setError("Please provide feedback before requesting changes.");
      return;
    }

    const result = await projectService.requestPlanChanges(id, userId, feedback.trim());
    if (result.ok) {
      setMessage("Change request sent to admin.");
      loadPage();
    } else {
      setError(result.message || "Failed to request changes");
    }
  };

  const handleSignOff = async () => {
    setMessage("");
    setError("");
    const result = await projectService.signOffDelivery(id, userId);
    if (result.ok) {
      setMessage("Delivery signed off successfully.");
      loadPage();
    } else {
      setError(result.message || "Failed to sign off delivery");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Project View</h1>
            <p className="mt-2 text-sm text-slate-500">
              {project ? `${project.title} (${project.status})` : `Project ${id}`}
            </p>
            <div className="mt-4">
              <button
                onClick={handleSignOff}
                disabled={!canSignOff}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                Sign Off Delivery
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Stage 3: Proposal Review</h2>
            {plan ? (
              <>
                <p className="mt-2 text-sm text-slate-600">
                  Timeline: {plan.timelineStart} to {plan.timelineEnd}
                </p>
                <p className="mt-2 text-sm text-slate-600">Notes: {plan.notes}</p>
                {Array.isArray(plan.milestones) && plan.milestones.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {plan.milestones.map((m) => (
                      <li key={m.id || `${m.title}-${m.orderIndex}`}>
                        {m.title} ({m.dueDate})
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No proposal has been created yet.</p>
            )}

            <div className="mt-4 grid gap-3">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="Write what you want changed in the proposal"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAcceptPlan}
                  disabled={!canReviewProposal || !plan}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                >
                  Mark As Done (Accept)
                </button>
                <button
                  onClick={handleRequestChange}
                  disabled={!canReviewProposal || !plan}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                >
                  Need Change
                </button>
              </div>
            </div>
          </section>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {message && <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>}

          {latestPreview?.cdnUrl ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Latest Submission Preview</h2>
              <CloudMediaViewer
                mediaUrl={latestPreview.cdnUrl}
                fileType={latestPreview.fileType}
                title="Latest submitted media"
              />
            </section>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Editor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Submission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={4}>Loading tasks...</td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={4}>No tasks created yet.</td>
                  </tr>
                ) : tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{task.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{task.assignedEditor?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{task.status}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {task.latestSubmission?.cdnUrl ? (
                        <a href={task.latestSubmission.cdnUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-600">
                          v{task.latestSubmission.versionNumber}
                        </a>
                      ) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}


