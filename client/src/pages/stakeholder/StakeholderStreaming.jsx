import React from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import { useAuth } from "../../context/AuthContext";
import TaskStreamPanel from "../../components/media/TaskStreamPanel";
import projectService from "../../services/projectService";

export default function StakeholderStreaming() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { userId } = useAuth();
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    const loadProjects = async () => {
      if (!userId) return;
      const result = await projectService.getClientProjects(userId);
      if (result.ok) {
        setProjects(result.data || []);
      } else {
        setProjects([]);
      }
    };
    loadProjects();
  }, [userId]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Streaming</h1>
            <p className="mt-2 text-sm text-slate-500">Watch live stream output and review broadcast status in real time.</p>
          </section>

          <TaskStreamPanel
            heading="Stakeholder Stream"
            description="Select project and task to stream stakeholder-visible cloud media."
            projects={projects}
            loadTasks={(projectId) => projectService.getStakeholderProjectTasks(projectId, userId)}
            loadStreamUrl={(taskId) => projectService.getStakeholderTaskStreamUrl(taskId)}
          />
        </div>
      </main>
    </div>
  );
}
