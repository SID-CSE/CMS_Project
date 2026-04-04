import React from "react";
import { useParams } from "react-router-dom";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";

export default function EditorVersionHistory() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { id } = useParams();

  const versions = [
    { id: "v5", label: "Current", note: "Headline rewritten, CTA updated" },
    { id: "v4", label: "Previous", note: "Visual sequence adjusted" },
    { id: "v3", label: "Initial review", note: "Comments from admin added" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Version History</h1>
            <p className="mt-2 text-sm text-slate-500">Content ID: {id}. Compare current and previous versions side-by-side.</p>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Side-by-side Diff</h2>
              <div className="mt-3 h-96 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Version A vs Version B diff canvas</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Available Versions</h2>
              <div className="mt-3 space-y-2">
                {versions.map((version) => (
                  <div key={version.id} className="rounded-xl bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">{version.id} • {version.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{version.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


