import React from "react";
import CloudMediaViewer from "./CloudMediaViewer";

export default function TaskStreamPanel({
  heading,
  description,
  projects = [],
  loadTasks,
  loadSubmissions,
  loadStreamUrl,
  resolveDirectMedia,
  approveTask,
  approveLabel = "Approve task",
  extraActions = [],
}) {
  const [projectId, setProjectId] = React.useState("");
  const [taskId, setTaskId] = React.useState("");
  const [submissionId, setSubmissionId] = React.useState("");
  const [tasks, setTasks] = React.useState([]);
  const [submissions, setSubmissions] = React.useState([]);
  const [streamUrl, setStreamUrl] = React.useState("");
  const [streamFileType, setStreamFileType] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const selectedTask = tasks.find((item) => item.id === taskId) || null;
  const selectedSubmission = submissions.find((item) => item.id === submissionId) || null;

  React.useEffect(() => {
    if (!projects.length) return;
    if (!projectId || !projects.some((project) => project.id === projectId)) {
      setProjectId(projects[0].id);
    }
  }, [projectId, projects]);

  React.useEffect(() => {
    const run = async () => {
      if (!loadTasks || !projectId) {
        setTasks([]);
        setTaskId("");
        return;
      }

      const result = await loadTasks(projectId);
      if (!result.ok) {
        setError(result.message || "Failed to load project tasks");
        setTasks([]);
        setTaskId("");
        return;
      }

      const nextTasks = result.data || [];
      setTasks(nextTasks);
      setTaskId((prev) => (nextTasks.some((task) => task.id === prev) ? prev : (nextTasks[0]?.id || "")));
    };

    run();
  }, [loadTasks, projectId]);

  React.useEffect(() => {
    const run = async () => {
      setSubmissionId("");
      setSubmissions([]);

      if (!taskId || !loadSubmissions) {
        return;
      }

      const result = await loadSubmissions(taskId);
      if (!result.ok) {
        setError(result.message || "Failed to load submissions");
        return;
      }

      const nextSubmissions = result.data || [];
      setSubmissions(nextSubmissions);
      setSubmissionId(nextSubmissions[0]?.id || "");
    };

    run();
  }, [loadSubmissions, taskId]);

  const loadStream = async () => {
    setMessage("");
    setError("");

    if (!taskId) {
      setError("Select a task first.");
      return;
    }

    if (!loadStreamUrl && !resolveDirectMedia) {
      setError("Streaming is not configured for this view.");
      return;
    }

    setBusy(true);
    try {
      if (resolveDirectMedia) {
        const direct = resolveDirectMedia(selectedTask, selectedSubmission);
        if (!direct?.url) {
          throw new Error("No media available for selected task/submission");
        }
        setStreamUrl(direct.url);
        setStreamFileType(direct.fileType || "");
        setMessage("Loaded cloud media.");
        return;
      }

      const result = await loadStreamUrl(taskId, submissionId || null);
      if (!result?.ok) {
        throw new Error(result?.message || "Failed to load stream URL");
      }
      const url = result.data?.streamUrl || result.data?.stream_url || "";
      if (!url) {
        throw new Error("Backend did not return a stream URL");
      }

      setStreamUrl(url);
      setStreamFileType(selectedSubmission?.fileType || selectedTask?.latestSubmission?.fileType || selectedTask?.contentType || "");
      setMessage(`Stream URL expires at ${result.data?.expiresAt || "unknown"}.`);
    } catch (streamError) {
      setError(streamError.message || "Failed to load stream URL");
    } finally {
      setBusy(false);
    }
  };

  const handleApprove = async () => {
    if (!approveTask) {
      return;
    }

    setMessage("");
    setError("");
    if (!taskId) {
      setError("Select a task first.");
      return;
    }

    setBusy(true);
    try {
      const result = await approveTask(taskId);
      if (!result.ok) {
        throw new Error(result.message || "Failed to approve task");
      }
      setMessage("Task approved.");
    } catch (approveError) {
      setError(approveError.message || "Failed to approve task");
    } finally {
      setBusy(false);
    }
  };

  const runExtraAction = async (actionConfig) => {
    if (!actionConfig?.action) {
      return;
    }

    setMessage("");
    setError("");
    if (!taskId) {
      setError("Select a task first.");
      return;
    }

    setBusy(true);
    try {
      const result = await actionConfig.action(taskId);
      if (!result.ok) {
        throw new Error(result.message || "Failed to run action");
      }
      setMessage(actionConfig.successMessage || "Action completed.");
    } catch (actionError) {
      setError(actionError.message || "Failed to run action");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Project</span>
          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {!projects.length ? <option value="">No projects</option> : null}
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title || `Project ${project.id}`} ({project.status || "-"})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Task</span>
          <select
            value={taskId}
            onChange={(event) => setTaskId(event.target.value)}
            className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {!tasks.length ? <option value="">No tasks</option> : null}
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title} ({task.status})
              </option>
            ))}
          </select>
        </label>

        {loadSubmissions ? (
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Submission</span>
            <select
              value={submissionId}
              onChange={(event) => setSubmissionId(event.target.value)}
              className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            >
              {!submissions.length ? <option value="">No submissions</option> : null}
              {submissions.map((submission) => (
                <option key={submission.id} value={submission.id}>
                  {submission.versionNumber ? `v${submission.versionNumber}` : submission.id} ({submission.fileType || "FILE"})
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">

        <button
          type="button"
          onClick={loadStream}
          disabled={busy || !taskId}
          className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Loading..." : "Load stream"}
        </button>

        {approveTask ? (
          <button
            type="button"
            onClick={handleApprove}
          disabled={busy}
            className="h-10 rounded-xl border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {approveLabel}
          </button>
        ) : null}

        {extraActions.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => runExtraAction(item)}
            disabled={busy}
            className="h-10 rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {item.label}
          </button>
        ))}
      </div>

      {selectedTask ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Task Details</p>
          <p className="mt-1">Project: {selectedTask.projectTitle || projectId || "-"}</p>
          <p>Status: {selectedTask.status || "-"}</p>
          <p>Content Type: {selectedTask.contentType || streamFileType || "-"}</p>
        </div>
      ) : null}

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      {streamUrl ? (
        <CloudMediaViewer
          mediaUrl={streamUrl}
          fileType={streamFileType}
          title="Cloud stream/media preview"
        />
      ) : null}
    </section>
  );
}