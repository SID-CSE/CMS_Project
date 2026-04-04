import React from "react";
import { useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import RoleMessagesLayout from "../../components/messaging/RoleMessagesLayout";

const contacts = [
  {
    key: "editor-ananya",
    name: "Ananya Jain",
    email: "ananya.editor@contify",
    subtitle: "Senior editor • Homepage redesign",
    status: "considering",
    tags: ["Editor", "Priority"],
    messages: [
      {
        id: "a1",
        sender: "other",
        text: "Homepage redesign copy is ready for your final review.",
        timestamp: "2026-04-03T08:05:00.000Z",
      },
      {
        id: "a2",
        sender: "self",
        text: "Great. Please include a short CTA variant for mobile too.",
        timestamp: "2026-04-03T08:20:00.000Z",
      },
    ],
  },
  {
    key: "stakeholder-neha",
    name: "Neha Sharma",
    email: "neha.stakeholder@contify",
    subtitle: "Stakeholder • Product launch page",
    status: "submitted",
    tags: ["Stakeholder", "Approvals"],
    messages: [
      {
        id: "n1",
        sender: "other",
        text: "Can we move the launch page publish time to 6 PM?",
        timestamp: "2026-04-03T06:30:00.000Z",
      },
    ],
  },
  {
    key: "system",
    name: "Contify System",
    email: "notifications@contify",
    subtitle: "Platform alerts and workflow updates",
    status: "system",
    tags: ["System"],
    messages: [
      {
        id: "s1",
        sender: "other",
        text: "3 projects are waiting for admin approval.",
        timestamp: "2026-04-03T05:10:00.000Z",
      },
    ],
  },
];

export default function AdminMessages() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-2xl font-semibold text-slate-900">Admin messages</h1>
            <p className="mt-2 text-sm text-slate-500">
              Coordinate with editors, stakeholders, and system notifications from one place.
            </p>
          </section>

          <RoleMessagesLayout
            roleLabel="Admin"
            listTitle="Team conversations"
            contacts={contacts}
            helperText="Use this thread to provide quick decisions, unblock editors, and keep projects moving."
          />
        </div>
      </main>
    </div>
  );
}


