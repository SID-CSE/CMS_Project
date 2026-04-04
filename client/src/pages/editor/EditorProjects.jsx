import React from "react";
import { Link } from "react-router-dom";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import { editorProjects } from "../../data/workflowData";

export default function EditorProjects() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">My Projects</h1>
            <p className="mt-2 text-sm text-slate-500">Read-only list of projects where you are an assigned editor.</p>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {editorProjects.map((project) => (
              <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{project.id}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">{project.name}</h2>
                <p className="mt-2 text-sm text-slate-500">Role: {project.role}</p>
                <p className="mt-1 text-sm text-slate-500">Items: {project.contentCount}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{project.status}</span>
                  <Link to={`/projects/${project.id}/content`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Open content
                  </Link>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}


