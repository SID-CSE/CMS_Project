export const editorProjects = [
  { id: "pj-101", name: "Q2 Product Launch", status: "Active", contentCount: 12, role: "Copy + review" },
  { id: "pj-102", name: "Knowledge Base Refresh", status: "Active", contentCount: 8, role: "Technical editor" },
  { id: "pj-103", name: "Customer Stories", status: "In Review", contentCount: 5, role: "Narrative editor" },
];

export const projectContent = [
  { id: "ct-501", projectId: "pj-101", title: "Landing Hero Script", status: "In Progress", owner: "A. Jain", updatedAt: "2026-04-03 10:20" },
  { id: "ct-502", projectId: "pj-101", title: "Feature Highlight Reel", status: "In Review", owner: "S. Rao", updatedAt: "2026-04-03 09:50" },
  { id: "ct-503", projectId: "pj-101", title: "Launch Email Draft", status: "Draft", owner: "M. Iyer", updatedAt: "2026-04-02 17:40" },
  { id: "ct-601", projectId: "pj-102", title: "FAQ Explainer", status: "In Progress", owner: "A. Jain", updatedAt: "2026-04-03 08:10" },
  { id: "ct-602", projectId: "pj-102", title: "Troubleshooting Walkthrough", status: "In Review", owner: "S. Rao", updatedAt: "2026-04-02 20:15" },
];

export const editorNotifications = [
  "You were assigned to Landing Hero Script",
  "Revision requested on Feature Highlight Reel",
  "Comment thread resolved on FAQ Explainer",
];

export const stakeholderNotifications = [
  "Q2 Product Launch content approved and ready",
  "Customer Stories package available for sign-off",
];

export const adminAuditEvents = [
  { id: "a1", actor: "Admin", action: "Status override", target: "ct-502", timestamp: "2026-04-03 09:41" },
  { id: "a2", actor: "Admin", action: "Reviewer reassigned", target: "ct-601", timestamp: "2026-04-03 08:55" },
  { id: "a3", actor: "System", action: "Slack integration sync", target: "workspace", timestamp: "2026-04-03 08:33" },
];
