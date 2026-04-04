import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const quickLinks = [
  { label: "Dashboard", description: "Overview and tasks", to: "/dashboard" },
  { label: "Projects", description: "View assigned projects", to: "/projects" },
  { label: "Project content", description: "Open content list by project", to: "/projects/pj-101/content" },
  { label: "Content viewer", description: "Frame-level review and comments", to: "/content/ct-501/view" },
  { label: "Version history", description: "Compare current and previous versions", to: "/content/ct-501/versions" },
  { label: "Notifications", description: "Assignments and revision alerts", to: "/notifications" },
  { label: "Messages", description: "Open conversation inbox", to: "/editor/messages" },
  { label: "Profile", description: "Manage your editor profile", to: "/editor/profile" },
  { label: "Finance", description: "View earnings and payouts", to: "/editor/finance" },
  { label: "My content", description: "Manage drafts and posts", to: "/editor/content" },
  { label: "Streaming", description: "Open live stream preview", to: "/editor/streaming" },
];

function MenuIcon() {
  return (
    <span className="flex flex-col gap-1.5">
      <span className="h-0.5 w-5 rounded-full bg-slate-700" />
      <span className="h-0.5 w-5 rounded-full bg-slate-700" />
      <span className="h-0.5 w-5 rounded-full bg-slate-700" />
    </span>
  );
}

function SearchIcon() {
  return <span className="text-base text-slate-400">⌕</span>;
}

function ChevronIcon({ open }) {
  return <span className={`text-xs text-slate-500 transition ${open ? "rotate-180" : ""}`}>⌄</span>;
}

export default function EditorNavbar({ onMenuClick, sidebarOpen = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return quickLinks;
    return quickLinks.filter((item) => {
      return (
        item.label.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value) ||
        item.to.toLowerCase().includes(value)
      );
    });
  }, [query]);

  const isPathActive = (to) => {
    const [pathname, hash] = to.split("#");
    return hash
      ? location.pathname === pathname && location.hash === `#${hash}`
      : location.pathname === to;
  };

  const handleNavigate = (to) => {
    navigate(to);
    setProfileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 z-30 h-16 border-b border-slate-200 bg-white/90 backdrop-blur transition-all duration-300 ${
        sidebarOpen ? "left-0 w-full lg:left-70 lg:w-[calc(100%-17.5rem)]" : "left-0 w-full"
      }`}
    >
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
              aria-label="Toggle sidebar"
            >
              <MenuIcon />
            </button>
          )}

          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-900">Contify</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Editor portal</p>
          </div>
        </div>

        <div className="relative hidden w-full max-w-xl lg:block">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-sm">
            <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search drafts, posts, media..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {query.trim() && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <button
                    key={item.to}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleNavigate(item.to)}
                    className={`flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition hover:bg-slate-50 ${
                      isPathActive(item.to) ? "bg-blue-50" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                    </div>
                    {isPathActive(item.to) && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500">No results found.</div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setProfileOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 text-left shadow-sm transition hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            ED
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">Editor</p>
            <p className="text-xs text-slate-500">Content creator</p>
          </div>
          <ChevronIcon open={profileOpen} />
        </button>
      </div>

      {profileOpen && (
        <div className="absolute right-4 top-[calc(100%+10px)] w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <button
            type="button"
            onClick={() => handleNavigate("/dashboard")}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Open dashboard
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("/projects")}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("/editor/content")}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            My content
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("/editor/messages")}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Messages
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("/editor/profile")}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("/editor/finance")}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Finance
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("/editor/streaming")}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Streaming
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("/login")}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
