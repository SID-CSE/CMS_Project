import React from "react";
import { useState } from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import RoleDashboardView from "../../components/dashboard/RoleDashboardView";

const stats = [
  { title: "Approved Assets", value: "46", note: "Ready for campaign use" },
  { title: "Awaiting Approval", value: "6", note: "Pending final sign-off" },
  { title: "Published This Month", value: "31", note: "Across all channels" },
  { title: "Engagement Lift", value: "+18%", note: "Compared to last month" },
];

const sideSections = [
  {
    id: "approval-queue",
    title: "Approval Queue",
    items: [
      "Pricing page copy refresh • Medium risk",
      "Channel partner brochure • Low risk",
      "Security update bulletin • High risk",
    ],
    emptyText: "No pending approvals.",
  },
  {
    id: "team-consumption",
    title: "Team Consumption",
    items: [
      "Marketing • 14 approved assets",
      "Sales • 9 approved assets",
      "Customer success • 11 approved assets",
    ],
    emptyText: "No team insights available.",
  },
];

const activitySection = {
  title: "Recent Activity",
  items: [
    "Launch landing page approved and published",
    "3 assets moved to final review",
    "Stakeholder comments resolved on case study",
    "Monthly performance summary generated",
  ],
  emptyText: "No recent activity.",
};

export default function StakeholderDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <RoleDashboardView
            portalLabel="Stakeholder Portal"
            headline="Welcome Back, Stakeholder"
            subtitle="Review approvals, monitor content impact, and guide publishing priorities."
            primaryAction={{ label: "View Content Library", to: "/stakeholder/content" }}
            secondaryAction={{ label: "Open Messages", to: "/stakeholder/messages" }}
            stats={stats}
            mainSection={{
              id: "approval-overview",
              title: "Approval Performance",
              subtitle: "Approval and publishing trend over the last 30 days",
            }}
            sideSections={sideSections}
            activitySection={activitySection}
          />
        </div>
      </main>
    </div>
  );
}


