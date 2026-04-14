import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import RoleDashboardView from "../../components/dashboard/RoleDashboardView";
import { authService } from "../../services/authService";
import { getAdminDashboardData } from "../../services/workflowService";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    sideSections: [],
    activitySection: { title: "Recent Activity", items: [], emptyText: "No recent activity." },
    trend: { labels: [], values: [] },
    lastUpdated: null,
    hasPartialData: false,
  });

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminDashboardData(authService.getUserId());
      setDashboardData(data);
    } catch {
      setDashboardData({
        stats: [],
        sideSections: [],
        activitySection: { title: "Recent Activity", items: [], emptyText: "No recent activity." },
        trend: { labels: [], values: [] },
        lastUpdated: null,
        hasPartialData: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]}  />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <RoleDashboardView
            portalLabel="Admin Portal"
            headline="Welcome Back, Admin"
            subtitle="Manage projects, review workflows, and editorial operations from a single dashboard."
            primaryAction={{ label: "Open Projects", to: "/admin/projects" }}
            secondaryAction={{ label: "Open Messages", to: "/admin/messages" }}
            stats={dashboardData.stats}
            mainSection={{
              id: "project-overview",
              title: "Project Performance",
              subtitle: "Publishing and review movement over the last 30 days",
            }}
            sideSections={dashboardData.sideSections}
            activitySection={dashboardData.activitySection}
            hasPartialData={dashboardData.hasPartialData}
            trend={dashboardData.trend}
            lastUpdated={dashboardData.lastUpdated}
            isLoading={isLoading}
            onRefresh={loadDashboard}
          />
        </div>
      </main>
    </div>
  );
}


