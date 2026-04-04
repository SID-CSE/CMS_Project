import React from "react";
import { Link } from "react-router-dom";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";

export default function StakeholderHome() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const projects = [
    { id: "pj-101", name: "Q2 Product Launch", pending: 3 },
    { id: "pj-103", name: "Customer Stories", pending: 2 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Stakeholder Home</h1>
            <p className="mt-2 text-sm text-slate-500">Projects shared with you and content awaiting sign-off.</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{project.id}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">{project.name}</h2>
                <p className="mt-2 text-sm text-slate-500">Awaiting attention: {project.pending}</p>
                <Link to={`/stakeholder/projects/${project.id}`} className="mt-4 inline-block text-sm font-medium text-blue-600">Open project</Link>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}


