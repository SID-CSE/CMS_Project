import React from "react";
import { useState } from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import RoleMessagesLayout from "../../components/messaging/RoleMessagesLayout";

const contacts = [
  {
    key: "admin-team",
    name: "Admin Team",
    email: "admin@contify",
    subtitle: "Approvals and priority escalations",
    status: "active",
    tags: ["Approvals", "Priority"],
    messages: [
      {
        id: "st1",
        sender: "other",
        text: "Please review the security bulletin copy before 3 PM.",
        timestamp: "2026-04-03T06:40:00.000Z",
      },
      {
        id: "st2",
        sender: "self",
        text: "Reviewing now. I will confirm in 20 minutes.",
        timestamp: "2026-04-03T06:53:00.000Z",
      },
    ],
  },
  {
    key: "editor-riya",
    name: "Riya Kapoor",
    email: "riya.editor@contify",
    subtitle: "Editor • Support center onboarding guide",
    status: "considering",
    tags: ["Editor", "Content quality"],
    messages: [
      {
        id: "st3",
        sender: "other",
        text: "Do you want a shorter version for social channels too?",
        timestamp: "2026-04-03T05:30:00.000Z",
      },
    ],
  },
  {
    key: "system",
    name: "Contify System",
    email: "notifications@contify",
    subtitle: "Approval and publishing summaries",
    status: "system",
    tags: ["System"],
    messages: [
      {
        id: "st4",
        sender: "other",
        text: "Monthly engagement report is ready to review.",
        timestamp: "2026-04-03T03:50:00.000Z",
      },
    ],
  },
];

export default function StakeholderMessages() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-2xl font-semibold text-slate-900">Stakeholder messages</h1>
            <p className="mt-2 text-sm text-slate-500">
              Track approval conversations, ask for revisions, and confirm publishing priorities quickly.
            </p>
          </section>

          <RoleMessagesLayout
            roleLabel="Stakeholder"
            listTitle="Approval conversations"
            contacts={contacts}
            helperText="Use this space for approval decisions, risk notes, and campaign timing updates."
          />
        </div>
      </main>
    </div>
  );
}


