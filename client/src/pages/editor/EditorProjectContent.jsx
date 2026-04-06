import React from "react";
import { useParams } from "react-router-dom";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import { useAuth } from "../../context/AuthContext";
import projectService from "../../services/projectService";

export default function EditorProjectContent() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { id } = useParams();
  const { userId } = useAuth();
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [submissionInputs, setSubmissionInputs] = React.useState({});

  React.useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      const result = await projectService.getEditorTasks(userId);
      if (result.ok) {
        setTasks(result.data || []);
      } else {
        setError(result.message || "Failed to load tasks");
      }
      setLoading(false);
    };

    if (userId) {
      loadTasks();
    }
  }, [userId]);

  const rows = tasks.filter((task) => task.projectId === id);
  const filtered = statusFilter === "All" ? rows : rows.filter((task) => task.status === statusFilter);

  const handleSubmitWork = async (taskId) => {
    setMessage("");
    setError("");
    const current = submissionInputs[taskId] || {};
    if (!current.cdnUrl || !current.fileType) {
      setError("Please provide both CDN URL and file type before submitting.");
      return;
    }

    const result = await projectService.submitTask(taskId, userId, {
      cdnUrl: current.cdnUrl,
      fileType: current.fileType,
      s3Key: current.s3Key || "",
    });

    if (result.ok) {
      setMessage("Task submitted successfully.");
      const refresh = await projectService.getEditorTasks(userId);
      if (refresh.ok) {
        setTasks(refresh.data || []);
      }
    } else {
      setError(result.message || "Failed to submit task");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Project Content</h1>
                <p className="mt-2 text-sm text-slate-500">Project {id} tasks assigned to you. Submit work links for admin review.</p>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm"
              >
                <option>All</option>
                <option>ASSIGNED</option>
                <option>SUBMITTED</option>
                <option>APPROVED</option>
                <option>NEEDS_REVISION</option>
              </select>
            </div>
          </section>

          {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {message && <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Deadline</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={5}>Loading tasks...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={5}>No tasks for this project.</td>
                  </tr>
                ) : filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.contentType}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.status}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.deadline}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <input
                          value={submissionInputs[item.id]?.cdnUrl || ""}
                          onChange={(e) => setSubmissionInputs((prev) => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], cdnUrl: e.target.value },
                          }))}
                          className="w-48 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                          placeholder="https://cdn/file"
                        />
                        <input
                          value={submissionInputs[item.id]?.fileType || ""}
                          onChange={(e) => setSubmissionInputs((prev) => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], fileType: e.target.value },
                          }))}
                          className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                          placeholder="mp4"
                        />
                        <button
                          onClick={() => handleSubmitWork(item.id)}
                          className="rounded-lg border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700"
                        >
                          Submit
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


