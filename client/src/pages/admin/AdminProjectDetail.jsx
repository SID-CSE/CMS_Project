import React from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import projectService from "../../services/projectService";
import { useAuth } from "../../context/AuthContext";

export default function AdminProjectDetail() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { id } = useParams();
  const { userId } = useAuth();

  const [project, setProject] = React.useState(null);
  const [plan, setPlan] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);
  const [editors, setEditors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [taskForm, setTaskForm] = React.useState({
    title: "",
    description: "",
    contentType: "VIDEO",
    assignedTo: "",
    deadline: "",
  });
  const [planForm, setPlanForm] = React.useState({
    timelineStart: "",
    timelineEnd: "",
    notes: "",
    milestonesRaw: "Kickoff",
  });

  const loadPage = React.useCallback(async () => {
    setLoading(true);
    setError("");

    const [projectResult, tasksResult, editorsResult, planResult] = await Promise.all([
      projectService.getAdminProjectDetail(id),
      projectService.getProjectTasksForAdmin(id),
      projectService.getEditors(),
      projectService.getProjectPlan(id),
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

    if (editorsResult.ok) {
      setEditors(editorsResult.data || []);
      if (!taskForm.assignedTo && editorsResult.data?.length > 0) {
        setTaskForm((prev) => ({ ...prev, assignedTo: editorsResult.data[0].id }));
      }
    }

    setLoading(false);
  }, [id, taskForm.assignedTo]);

  React.useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const result = await projectService.createTask(id, userId, taskForm);
    if (result.ok) {
      setMessage("Task created and assigned successfully.");
      setTaskForm((prev) => ({ ...prev, title: "", description: "", deadline: "" }));
      loadPage();
    } else {
      setError(result.message || "Failed to create task");
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const milestoneLines = planForm.milestonesRaw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const milestones = milestoneLines.map((title, index) => ({
      title,
      dueDate: planForm.timelineEnd,
      orderIndex: index + 1,
    }));

    const result = await projectService.createProjectPlan(id, userId, {
      timelineStart: planForm.timelineStart,
      timelineEnd: planForm.timelineEnd,
      notes: planForm.notes,
      milestones,
    });

    if (result.ok) {
      setMessage("Proposal created successfully.");
      loadPage();
    } else {
      setError(result.message || "Failed to create proposal");
    }
  };

  const handleSendProposal = async () => {
    setMessage("");
    setError("");

    const result = await projectService.sendPlanToClient(id, userId);
    if (result.ok) {
      setMessage("Proposal sent to stakeholder.");
      loadPage();
    } else {
      setError(result.message || "Failed to send proposal");
    }
  };

  const handleReview = async (taskId, action) => {
    setMessage("");
    setError("");

    const feedback = window.prompt(
      action === "APPROVE" ? "Optional approval note:" : "Revision feedback for editor:"
    ) || "";

    const result = await projectService.reviewTask(taskId, userId, {
      action,
      feedback,
    });

    if (result.ok) {
      setMessage(action === "APPROVE" ? "Submission approved." : "Revision requested.");
      loadPage();
    } else {
      setError(result.message || "Failed to update review");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Project Detail</h1>
            <p className="mt-2 text-sm text-slate-500">
              {project ? `${project.title} (${project.status})` : `Project ${id}`}
            </p>
          </section>

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {message && <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Stage 2: Proposal To Stakeholder</h2>
              <button
                onClick={handleSendProposal}
                disabled={!plan || project?.status !== "REQUESTED"}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                Send Proposal
              </button>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Fill proposal details clearly so the stakeholder can approve without extra clarification.
            </p>

            <form onSubmit={handleCreatePlan} className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Project title (reference)</span>
                <input
                  type="text"
                  value={project?.title || `Project ${id}`}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700">Timeline start date</span>
                <input
                  type="date"
                  required
                  value={planForm.timelineStart}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, timelineStart: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700">Timeline end date</span>
                <input
                  type="date"
                  required
                  value={planForm.timelineEnd}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, timelineEnd: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Proposal summary for stakeholder</span>
                <textarea
                  required
                  value={planForm.notes}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Example: We will deliver 3 Instagram reels, 2 banner designs, and homepage copy. Review checkpoints every Friday."
                />
                <p className="text-xs text-slate-500">Write scope, expected deliverables, and review schedule in plain language.</p>
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Milestones (one line per milestone)</span>
                <textarea
                  value={planForm.milestonesRaw}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, milestonesRaw: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  rows={4}
                  placeholder={"Kickoff call\nDraft delivery\nClient review\nFinal delivery"}
                />
                <p className="text-xs text-slate-500">Each line becomes a milestone tied to the timeline end date.</p>
              </label>
              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Create / Update Proposal
                </button>
                {plan && (
                  <p className="text-sm text-slate-500">
                    Current proposal: {plan.timelineStart} to {plan.timelineEnd}
                  </p>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Assign New Task</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create a task with clear deliverable instructions so the editor can submit the right output in one attempt.
            </p>
            <form onSubmit={handleCreateTask} className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Project title (reference)</span>
                <input
                  type="text"
                  value={project?.title || `Project ${id}`}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700">Task title</span>
                <input
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Example: Instagram reel - product teaser (15 sec)"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700">Submission deadline</span>
                <input
                  required
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, deadline: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700">Content type</span>
                <select
                  value={taskForm.contentType}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, contentType: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="VIDEO">VIDEO</option>
                  <option value="IMAGE">IMAGE</option>
                  <option value="DESIGN">DESIGN</option>
                  <option value="COPY">COPY</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700">Assign editor</span>
                <select
                  required
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {editors.map((editor) => (
                    <option key={editor.id} value={editor.id}>
                      {editor.name} ({editor.email})
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Task instructions</span>
                <textarea
                  required
                  value={taskForm.description}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Include objective, required format, dimensions/duration, tone, reference links, and acceptance criteria. Example: 1080x1920, under 15 seconds, upbeat style, include CTA in final 3 seconds."
                />
                <p className="text-xs text-slate-500">Tip: Write the output format and approval checklist explicitly.</p>
              </label>
              <div className="md:col-span-2">
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Create Task
                </button>
              </div>
            </form>
          </section>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Editor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Submission</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={7}>Loading tasks...</td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={7}>No tasks yet. Create one above.</td>
                  </tr>
                ) : tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{task.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{task.contentType}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{task.status}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{task.assignedEditor?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {task.latestSubmission?.cdnUrl ? (
                        <a href={task.latestSubmission.cdnUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                          v{task.latestSubmission.versionNumber}
                        </a>
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleReview(task.id, "APPROVE")}
                          disabled={!task.latestSubmission}
                          className="rounded-lg border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700 disabled:opacity-40"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReview(task.id, "REQUEST_REVISION")}
                          disabled={!task.latestSubmission}
                          className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 disabled:opacity-40"
                        >
                          Revision
                        </button>
                      </div>
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


