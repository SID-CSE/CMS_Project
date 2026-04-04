import React from "react";
import { useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import RoleDashboardView from "../../components/dashboard/RoleDashboardView";

const stats = [
  { title: "Active Projects", value: "12", note: "3 waiting for final review" },
  { title: "Pending Reviews", value: "7", note: "2 marked urgent" },
  { title: "Editors Online", value: "5", note: "2 currently publishing" },
  { title: "Published Today", value: "18", note: "Across all channels" },
];

const sideSections = [
  {
    id: "review-queue",
    title: "Review Queue",
    items: [
      "Landing page copy needs approval",
      "Q2 blog batch needs edits",
      "Newsletter draft ready to publish",
    ],
    emptyText: "No pending actions.",
  },
  {
    id: "editors",
    title: "Editors",
    items: [
      "Ananya Jain • Available",
      "Siddharth Rao • Busy",
      "Meera Iyer • Available",
    ],
    emptyText: "No editor updates.",
  },
];

const activitySection = {
  title: "Recent Activity",
  items: [
    "Homepage redesign moved to review",
    "3 articles published to blog",
    "Case study library assigned to new editor",
    "SEO checklist completed for launch page",
  ],
  emptyText: "No recent activity.",
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
            primaryAction={{ label: "Manage Users", to: "/admin/users" }}
            secondaryAction={{ label: "Open Messages", to: "/admin/messages" }}
            stats={stats}
            mainSection={{
              id: "project-overview",
              title: "Project Performance",
              subtitle: "Publishing and review movement over the last 30 days",
            }}
            sideSections={sideSections}
            activitySection={activitySection}
          />
        </div>
      </main>
    </div>
  );
}


