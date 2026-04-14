import React, { useEffect, useState } from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import RoleDashboardView from "../../components/dashboard/RoleDashboardView";
import { authService } from "../../services/authService";
import { getEditorDashboardData } from "../../services/workflowService";

export default function EditorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    sideSections: [],
    activitySection: { title: "Recent Activity", items: [], emptyText: "No recent updates." },
    trend: { labels: [], values: [] },
    lastUpdated: null,
    hasPartialData: false,
  });

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await getEditorDashboardData(authService.getUserId());
      setDashboardData(data);
    } catch {
      setDashboardData({
        stats: [],
        sideSections: [],
        activitySection: { title: "Recent Activity", items: [], emptyText: "No recent updates." },
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
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <RoleDashboardView
            portalLabel="Editor Portal"
            headline="Welcome Back, Editor"
            subtitle="Track drafts, manage feedback, and keep your publishing queue on schedule."
            primaryAction={{ label: "Open My Content", to: "/editor/content" }}
            secondaryAction={{ label: "Open Messages", to: "/editor/messages" }}
            stats={dashboardData.stats}
            mainSection={{
              id: "content-overview",
              title: "Content Throughput",
              subtitle: "Draft and publish progress over the last 30 days",
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


