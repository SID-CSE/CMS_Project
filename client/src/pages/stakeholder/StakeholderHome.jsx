import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import projectService from "../../services/projectService";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";

export default function StakeholderHome() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userId } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const result = await projectService.getClientProjects(userId);
      
      if (result.ok) {
        setProjects(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const statusMap = {
      'REQUESTED': 'bg-blue-50 text-blue-700 border-blue-200',
      'PLAN_SENT': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'IN_PROGRESS': 'bg-purple-50 text-purple-700 border-purple-200',
      'DELIVERED': 'bg-green-50 text-green-700 border-green-200',
      'REVISION': 'bg-red-50 text-red-700 border-red-200',
      'SIGNED_OFF': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    return statusMap[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Stakeholder Home</h1>
                <p className="mt-2 text-sm text-slate-500">Projects shared with you and content awaiting sign-off.</p>
              </div>
              <Link to="/stakeholder/create-project-request" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                New Request
              </Link>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-500 mb-4">No projects yet</p>
              <Link to="/stakeholder/create-project-request" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Create Your First Request
              </Link>
            </div>
          ) : (
            <section className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{project.id}</p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{project.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{project.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(project.status)}`}>
                      {project.status}
                    </span>
                    <Link to={`/stakeholder/projects/${project.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      View Details →
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}


