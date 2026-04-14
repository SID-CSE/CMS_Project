import React from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import TaskStreamPanel from "../../components/media/TaskStreamPanel";
import projectService from "../../services/projectService";

export default function AdminStreaming() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    const loadProjects = async () => {
      const result = await projectService.getAllProjects();
      if (result.ok) {
        setProjects(result.data || []);
      } else {
        setProjects([]);
      }
    };
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]} />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Streaming</h1>
            <p className="mt-2 text-sm text-slate-500">Monitor live campaign streams and team broadcast activity.</p>
          </section>

          <TaskStreamPanel
            heading="Admin Task Stream"
            description="Select project/task/submission to review cloud media, then approve, hold, or forward."
            projects={projects}
            loadTasks={(projectId) => projectService.getProjectTasksForAdmin(projectId)}
            loadSubmissions={(taskId) => projectService.getAdminTaskSubmissions(taskId)}
            loadStreamUrl={(taskId, submissionId) => (
              submissionId
                ? projectService.getAdminSubmissionMediaUrl(submissionId)
                : projectService.getAdminTaskStreamUrl(taskId)
            )}
            approveTask={(taskId) => projectService.approveAdminTask(taskId)}
            approveLabel="Approve task"
            extraActions={[
              {
                label: "Put on hold",
                action: (taskId) => projectService.holdAdminTask(taskId),
                successMessage: "Task moved to hold/revision.",
              },
              {
                label: "Forward to stakeholder",
                action: (taskId) => projectService.forwardAdminTask(taskId),
                successMessage: "Task forwarded to stakeholder.",
              },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
