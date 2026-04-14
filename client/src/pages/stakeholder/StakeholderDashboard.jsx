import React, { useEffect, useState } from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import RoleDashboardView from "../../components/dashboard/RoleDashboardView";
import { authService } from "../../services/authService";
import { getStakeholderDashboardData } from "../../services/workflowService";

export default function StakeholderDashboard() {
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
      const data = await getStakeholderDashboardData(authService.getUserId());
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

    const intervalId = setInterval(() => {
      loadDashboard();
    }, 20000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <RoleDashboardView
            portalLabel="Stakeholder Portal"
            headline="Welcome Back, Stakeholder"
            subtitle="Live view of approvals, messages, finance actions, and delivery progress from backend data."
            primaryAction={{ label: "View Content Library", to: "/stakeholder/content" }}
            secondaryAction={{ label: "Open Messages", to: "/stakeholder/messages" }}
            stats={dashboardData.stats}
            mainSection={{
              id: "approval-overview",
              title: "Approval Performance",
              subtitle: "Approval and publishing trend over the last 30 days",
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


