const commonSearchItems = {
  profile: { label: "Profile", description: "View and update profile" },
  messages: { label: "Messages", description: "Open team conversations" },
  finance: { label: "Finance", description: "Check payments and transactions" },
};

export const roleNavigationConfig = {
  admin: {
    roleKey: "ADMIN",
    initials: "AD",
    portalLabel: "Admin portal",
    subtitle: "Operations control",
    homePath: "/admin/dashboard",
    statusTitle: "Publishing status",
    statusText: "Track approvals, quality gates, and delivery readiness.",
    searchItems: [
      { label: "Dashboard", description: "Overview and operational metrics", to: "/admin/dashboard", matchPrefixes: ["/admin/dashboard"] },
      { label: "Projects", description: "Manage active and completed projects", to: "/admin/projects", matchPrefixes: ["/admin/projects"] },
      { label: "Content board", description: "Review and approve content flow", to: "/admin/content", matchPrefixes: ["/admin/content"] },
      { label: "Analytics", description: "Performance and quality insights", to: "/admin/analytics", matchPrefixes: ["/admin/analytics"] },
      { label: "Audit log", description: "Track immutable activity events", to: "/admin/audit-log", matchPrefixes: ["/admin/audit-log"] },
      { label: "Settings", description: "Platform and policy configuration", to: "/admin/settings", matchPrefixes: ["/admin/settings"] },
      { label: "Users", description: "User access and role management", to: "/admin/users", matchPrefixes: ["/admin/users"] },
      { label: "Streaming", description: "Open submission stream monitor", to: "/admin/streaming", matchPrefixes: ["/admin/streaming"] },
      { ...commonSearchItems.messages, to: "/admin/messages", matchPrefixes: ["/admin/messages"] },
      { ...commonSearchItems.profile, to: "/admin/profile", matchPrefixes: ["/admin/profile"] },
      { ...commonSearchItems.finance, to: "/admin/finance", matchPrefixes: ["/admin/finance"] },
    ],
    sidebarSections: [
      {
        title: "Control",
        items: [
          { label: "Dashboard", to: "/admin/dashboard", matchPrefixes: ["/admin/dashboard"] },
          { label: "Projects", to: "/admin/projects", matchPrefixes: ["/admin/projects"] },
          { label: "Users", to: "/admin/users", matchPrefixes: ["/admin/users"] },
          { label: "Messages", to: "/admin/messages", matchPrefixes: ["/admin/messages"] },
        ],
      },
      {
        title: "Quality",
        items: [
          { label: "Content board", to: "/admin/content", matchPrefixes: ["/admin/content"] },
          { label: "Streaming", to: "/admin/streaming", matchPrefixes: ["/admin/streaming"] },
          { label: "Analytics", to: "/admin/analytics", matchPrefixes: ["/admin/analytics"] },
          { label: "Audit log", to: "/admin/audit-log", matchPrefixes: ["/admin/audit-log"] },
          { label: "Settings", to: "/admin/settings", matchPrefixes: ["/admin/settings"] },
        ],
      },
      {
        title: "Account",
        items: [
          { label: "Profile", to: "/admin/profile", matchPrefixes: ["/admin/profile"] },
          { label: "Finance", to: "/admin/finance", matchPrefixes: ["/admin/finance"] },
        ],
      },
    ],
  },
  editor: {
    roleKey: "EDITOR",
    initials: "ED",
    portalLabel: "Editor portal",
    subtitle: "Creative workspace",
    homePath: "/editor/dashboard",
    statusTitle: "Production status",
    statusText: "Track assigned tasks, revisions, and submissions in progress.",
    searchItems: [
      { label: "Dashboard", description: "Task overview and upcoming deadlines", to: "/editor/dashboard", matchPrefixes: ["/editor/dashboard", "/dashboard"] },
      { label: "Projects", description: "Open assigned project list", to: "/projects", matchPrefixes: ["/projects"] },
      { label: "My content", description: "Review all assigned content cards", to: "/editor/content", matchPrefixes: ["/editor/content"] },
      { label: "Notifications", description: "Assignment and review updates", to: "/notifications", matchPrefixes: ["/notifications"] },
      { label: "Streaming", description: "Preview stream and media pipeline", to: "/editor/streaming", matchPrefixes: ["/editor/streaming"] },
      { ...commonSearchItems.messages, to: "/editor/messages", matchPrefixes: ["/editor/messages"] },
      { ...commonSearchItems.profile, to: "/editor/profile", matchPrefixes: ["/editor/profile"] },
      { ...commonSearchItems.finance, to: "/editor/finance", matchPrefixes: ["/editor/finance"] },
    ],
    sidebarSections: [
      {
        title: "Workspace",
        items: [
          { label: "Dashboard", to: "/editor/dashboard", matchPrefixes: ["/editor/dashboard", "/dashboard"] },
          { label: "Projects", to: "/projects", matchPrefixes: ["/projects"] },
          { label: "My content", to: "/editor/content", matchPrefixes: ["/editor/content"] },
          { label: "Notifications", to: "/notifications", matchPrefixes: ["/notifications"] },
        ],
      },
      {
        title: "Delivery",
        items: [
          { label: "Streaming", to: "/editor/streaming", matchPrefixes: ["/editor/streaming"] },
          { label: "Messages", to: "/editor/messages", matchPrefixes: ["/editor/messages"] },
          { label: "Profile", to: "/editor/profile", matchPrefixes: ["/editor/profile"] },
          { label: "Finance", to: "/editor/finance", matchPrefixes: ["/editor/finance"] },
        ],
      },
    ],
  },
  stakeholder: {
    roleKey: "STAKEHOLDER",
    initials: "SH",
    portalLabel: "Stakeholder portal",
    subtitle: "Approval workspace",
    homePath: "/stakeholder/home",
    statusTitle: "Review status",
    statusText: "Monitor approvals, requests, and finalized project deliveries.",
    searchItems: [
      { label: "Home", description: "Approval-ready dashboard", to: "/stakeholder/home", matchPrefixes: ["/stakeholder/home"] },
      { label: "Create request", description: "Submit a new project request", to: "/stakeholder/create-project-request", matchPrefixes: ["/stakeholder/create-project-request", "/stakeholder/create-request"] },
      { label: "Projects", description: "Open project progress and approvals", to: "/stakeholder/projects", matchPrefixes: ["/stakeholder/projects"] },
      { label: "Content", description: "Browse stakeholder content board", to: "/stakeholder/content", matchPrefixes: ["/stakeholder/content"] },
      { label: "Notifications", description: "Latest project and review updates", to: "/stakeholder/notifications", matchPrefixes: ["/stakeholder/notifications"] },
      { label: "Streaming", description: "Watch delivery streams", to: "/stakeholder/streaming", matchPrefixes: ["/stakeholder/streaming"] },
      { ...commonSearchItems.messages, to: "/stakeholder/messages", matchPrefixes: ["/stakeholder/messages"] },
      { ...commonSearchItems.profile, to: "/stakeholder/profile", matchPrefixes: ["/stakeholder/profile"] },
      { ...commonSearchItems.finance, to: "/stakeholder/finance", matchPrefixes: ["/stakeholder/finance"] },
    ],
    sidebarSections: [
      {
        title: "Review",
        items: [
          { label: "Home", to: "/stakeholder/home", matchPrefixes: ["/stakeholder/home"] },
          { label: "Create request", to: "/stakeholder/create-project-request", matchPrefixes: ["/stakeholder/create-project-request", "/stakeholder/create-request"] },
          { label: "Projects", to: "/stakeholder/projects", matchPrefixes: ["/stakeholder/projects"] },
          { label: "Content", to: "/stakeholder/content", matchPrefixes: ["/stakeholder/content"] },
        ],
      },
      {
        title: "Communication",
        items: [
          { label: "Notifications", to: "/stakeholder/notifications", matchPrefixes: ["/stakeholder/notifications"] },
          { label: "Messages", to: "/stakeholder/messages", matchPrefixes: ["/stakeholder/messages"] },
          { label: "Streaming", to: "/stakeholder/streaming", matchPrefixes: ["/stakeholder/streaming"] },
          { label: "Profile", to: "/stakeholder/profile", matchPrefixes: ["/stakeholder/profile"] },
          { label: "Finance", to: "/stakeholder/finance", matchPrefixes: ["/stakeholder/finance"] },
        ],
      },
    ],
  },
};

export function getRoleNavigation(role) {
  return roleNavigationConfig[role] || roleNavigationConfig.editor;
}

export function isRoleRouteActive(pathname, item) {
  const matches = item.matchPrefixes || [item.to];
  return matches.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
