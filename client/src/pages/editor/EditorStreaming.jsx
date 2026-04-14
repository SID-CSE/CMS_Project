import React from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import { useAuth } from "../../context/AuthContext";
import TaskStreamPanel from "../../components/media/TaskStreamPanel";
import projectService from "../../services/projectService";

const toProjectList = (tasks) => {
  const map = new Map();
  (tasks || []).forEach((task) => {
    if (!task.projectId) return;
    if (!map.has(task.projectId)) {
      map.set(task.projectId, {
        id: task.projectId,
        title: task.projectTitle || `Project ${task.projectId}`,
        status: task.projectStatus || "IN_PROGRESS",
      });
    }
  });
  return Array.from(map.values());
};

export default function EditorStreaming() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { userId } = useAuth();
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    const loadTasks = async () => {
      if (!userId) return;
      const result = await projectService.getEditorTasks(userId);
      if (result.ok) {
        setTasks(result.data || []);
      } else {
        setTasks([]);
      }
    };
    loadTasks();
  }, [userId]);

  const projects = React.useMemo(() => toProjectList(tasks), [tasks]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Streaming</h1>
            <p className="mt-2 text-sm text-slate-500">Select your project and task to preview uploaded cloud media.</p>
          </section>

          <TaskStreamPanel
            heading="Editor Stream"
            description="Pick assigned tasks and preview latest submitted media from cloud storage."
            projects={projects}
            loadTasks={async (projectId) => ({
              ok: true,
              data: (tasks || []).filter((task) => task.projectId === projectId),
            })}
            resolveDirectMedia={(task) => ({
              url: task?.latestSubmission?.cdnUrl || "",
              fileType: task?.latestSubmission?.fileType || task?.contentType || "",
            })}
          />
        </div>
      </main>
    </div>
  );
}
