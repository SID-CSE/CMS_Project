import React from "react";
import { useState } from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import RoleMessagesLayout from "../../components/messaging/RoleMessagesLayout";

const contacts = [
  {
    key: "client-aurora",
    name: "Aurora Labs",
    email: "team@auroralabs",
    subtitle: "Client • AI trends explainer",
    status: "considering",
    tags: ["Client", "Active project"],
    messages: [
      {
        id: "c1",
        sender: "other",
        text: "We like the draft. Can you shorten section two?",
        timestamp: "2026-04-03T07:00:00.000Z",
      },
      {
        id: "c2",
        sender: "self",
        text: "Sure, I will share the revised version in an hour.",
        timestamp: "2026-04-03T07:12:00.000Z",
      },
    ],
  },
  {
    key: "admin-review",
    name: "Admin Review Desk",
    email: "admin@contify",
    subtitle: "Internal review and publishing approvals",
    status: "submitted",
    tags: ["Internal", "Review"],
    messages: [
      {
        id: "r1",
        sender: "other",
        text: "Please add one variant headline before publishing.",
        timestamp: "2026-04-03T06:15:00.000Z",
      },
    ],
  },
  {
    key: "system",
    name: "Contify System",
    email: "notifications@contify",
    subtitle: "Workflow and deadline reminders",
    status: "system",
    tags: ["System"],
    messages: [
      {
        id: "e1",
        sender: "other",
        text: "2 drafts are due today by 6 PM.",
        timestamp: "2026-04-03T04:55:00.000Z",
      },
    ],
  },
];

export default function EditorMessages() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-2xl font-semibold text-slate-900">Editor messages</h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage client feedback, internal reviewer notes, and platform updates in a single inbox.
            </p>
          </section>

          <RoleMessagesLayout
            roleLabel="Editor"
            listTitle="Conversation inbox"
            contacts={contacts}
            helperText="Keep replies crisp, confirm next actions, and share delivery timelines clearly."
          />
        </div>
      </main>
    </div>
  );
}


