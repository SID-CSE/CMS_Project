import React from "react";
import { useState } from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import RoleDashboardView from "../../components/dashboard/RoleDashboardView";

const stats = [
  { title: "Drafts In Progress", value: "9", note: "2 due today" },
  { title: "Pending Feedback", value: "4", note: "Awaiting reviewer comments" },
  { title: "Published This Week", value: "14", note: "Strong output trend" },
  { title: "Quality Score", value: "92%", note: "Average from last reviews" },
];

const sideSections = [
  {
    id: "publishing-queue",
    title: "Publishing Queue",
    items: [
      "April product digest • Today 5:30 PM",
      "Feature rollout email • Tomorrow 10:00 AM",
      "Help center update • Tomorrow 2:15 PM",
    ],
    emptyText: "No items in queue.",
  },
  {
    id: "review-notes",
    title: "Reviewer Notes",
    items: [
      "Add migration details to release note",
      "Include screenshots for onboarding guide",
      "SEO keyword alignment pending on case study",
    ],
    emptyText: "No reviewer notes.",
  },
];

const activitySection = {
  title: "Recent Activity",
  items: [
    "AI trends explainer moved to review",
    "2 pieces scheduled for publishing",
    "Reviewer comments resolved for onboarding guide",
    "SEO metadata completed for newsletter",
  ],
  emptyText: "No recent updates.",
};

export default function EditorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
            stats={stats}
            mainSection={{
              id: "content-overview",
              title: "Content Throughput",
              subtitle: "Draft and publish progress over the last 30 days",
            }}
            sideSections={sideSections}
            activitySection={activitySection}
          />
        </div>
      </main>
    </div>
  );
}


