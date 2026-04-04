import React from "react";
import { useParams } from "react-router-dom";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";

export default function StakeholderContentViewer() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { id } = useParams();
  const [note, setNote] = React.useState("");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Content Viewer</h1>
            <p className="mt-2 text-sm text-slate-500">Content {id}. Read-only stream with high-level sign-off note.</p>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.5fr,1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 text-sm font-medium text-slate-700">Stream Preview</div>
              <div className="flex h-96 items-center justify-center rounded-xl bg-slate-900 text-slate-100">Read-only media stream</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Sign-off</h2>
              <p className="mt-2 text-sm text-slate-500">Approval status: In Review</p>
              <textarea
                rows={6}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Leave a high-level sign-off comment"
                className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              <button className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">Submit sign-off comment</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


