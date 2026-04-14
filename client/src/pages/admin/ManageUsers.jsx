import React from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import { getTeamEditorProfiles } from "../../services/userService";
import UserIdentityLink from "../../components/profile/UserIdentityLink";

export default function ManageUsers() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [editors, setEditors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadEditors = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const profiles = await getTeamEditorProfiles();
      setEditors(Array.isArray(profiles) ? profiles : []);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || "Failed to load team editor profiles");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadEditors();
  }, [loadEditors]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]} />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Team Editors</h1>
                <p className="mt-2 text-sm text-slate-500">Editor profiles in your team. Click a name to open full profile details.</p>
              </div>
              <button
                type="button"
                onClick={loadEditors}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </section>

          {error ? (
            <section className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section>
          ) : null}

          {loading ? (
            <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              ))}
            </section>
          ) : editors.length === 0 ? (
            <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No editor profiles found for your team.
            </section>
          ) : (
            <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {editors.map((editor) => {
                const displayName = editor.displayName || `${editor.firstName || ""} ${editor.lastName || ""}`.trim() || editor.username;
                return (
                  <article key={editor.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <UserIdentityLink
                        userId={editor.id}
                        name={displayName}
                        role={editor.role}
                        profileImage={editor.profileImage}
                      />
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                        {editor.role || "Editor"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{editor.email || "No email"}</p>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p><span className="font-semibold text-slate-700">Team:</span> {editor.team || "Not specified"}</p>
                      <p><span className="font-semibold text-slate-700">Location:</span> {editor.location || "Not specified"}</p>
                      <p><span className="font-semibold text-slate-700">Specialization:</span> {editor.specialization || "Not specified"}</p>
                      <p className="line-clamp-2"><span className="font-semibold text-slate-700">Focus:</span> {editor.currentFocus || "Not specified"}</p>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
