import React from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import { editorNotifications } from "../../data/workflowData";

export default function EditorNotifications() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
            <p className="mt-2 text-sm text-slate-500">Assignments, revision requests, and resolved comment alerts.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-2">
              {editorNotifications.map((note) => (
                <div key={note} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{note}</div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


