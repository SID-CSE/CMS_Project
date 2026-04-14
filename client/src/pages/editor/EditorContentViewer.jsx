import React from "react";
import { Link, useParams } from "react-router-dom";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";

export default function EditorContentViewer() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Content Viewer</h1>
                <p className="mt-2 text-sm text-slate-500">Content ID: {id}. Annotate frame-level feedback and submit for formal review.</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/content/${id}/versions`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Version history</Link>
                <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Submit for review</button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.5fr,1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 text-sm font-medium text-slate-700">Stream Preview</div>
              <div className="flex h-96 items-center justify-center rounded-xl bg-slate-900 text-slate-100">Media stream preview canvas</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Frame Comments</h2>
              <p className="mt-3 text-sm text-slate-500">Comment APIs are not available yet. No local/mock comments are shown.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


