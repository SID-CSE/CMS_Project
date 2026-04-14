import apiClient from "./apiClient";
import projectService from "./projectService";

function unwrapList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function unwrapSingle(response) {
  if (response?.data) return response.data;
  return response;
}

export async function getNotifications(userId) {
  if (!userId) return [];
  const response = await apiClient.get(`/notifications?userId=${encodeURIComponent(userId)}`);
  return unwrapList(response);
}

export async function getEditorProjects(editorId) {
  if (!editorId) return [];

  const response = await apiClient.get(`/editor/tasks?editorId=${encodeURIComponent(editorId)}`);
  const tasks = unwrapList(response);

  const grouped = new Map();
  tasks.forEach((task) => {
    const projectId = task.projectId || "unknown";
    const existing = grouped.get(projectId) || {
      id: projectId,
      name: projectId,
      status: task.status || "Draft",
      contentCount: 0,
      role: "Assigned editor",
      updatedAt: task.updatedAt || task.createdAt || "",
    };

    existing.contentCount += 1;
    if (task.updatedAt && (!existing.updatedAt || task.updatedAt > existing.updatedAt)) {
      existing.updatedAt = task.updatedAt;
    }

    if (task.status === "SUBMITTED") {
      existing.status = "In Review";
    } else if (task.status === "APPROVED") {
      existing.status = "Approved";
    } else if (task.status === "NEEDS_REVISION") {
      existing.status = "Needs Revision";
    } else if (!existing.status || existing.status === "Draft") {
      existing.status = "Active";
    }

    grouped.set(projectId, existing);
  });

  return Array.from(grouped.values()).map((project) => ({
    ...project,
    name: `Project ${project.id}`,
  }));
}

export async function getActivityEntries(userId) {
  const notifications = await getNotifications(userId);
  return notifications.map((notification) => ({
    id: notification.id,
    actor: notification.type || "System",
    action: notification.title || "Notification",
    target: notification.relatedEntityId || notification.type || "workspace",
    timestamp: notification.createdAt || notification.timestamp || "",
    message: notification.message || "",
  }));
}

function buildStats(items) {
  return {
    total: items.length,
    inReview: items.filter((item) => item.status === "SUBMITTED" || item.status === "In Review").length,
    approved: items.filter((item) => item.status === "APPROVED" || item.status === "Approved").length,
    revision: items.filter((item) => item.status === "NEEDS_REVISION" || item.status === "Rejected").length,
  };
}

function summarizeTrendFromTasks(tasks) {
  const assigned = tasks.filter((task) => task.status === "ASSIGNED").length;
  const submitted = tasks.filter((task) => task.status === "SUBMITTED").length;
  const revision = tasks.filter((task) => task.status === "NEEDS_REVISION").length;
  const approved = tasks.filter((task) => task.status === "APPROVED").length;
  return [assigned, submitted, revision, approved, tasks.length];
}

function summarizeTrendFromProjects(projects) {
  const requested = projects.filter((project) => project.status === "REQUESTED").length;
  const inProgress = projects.filter((project) => project.status === "IN_PROGRESS").length;
  const revision = projects.filter((project) => project.status === "REVISION").length;
  const delivered = projects.filter((project) => project.status === "DELIVERED").length;
  const signedOff = projects.filter((project) => project.status === "SIGNED_OFF").length;
  return [requested, inProgress, revision, delivered, signedOff];
}

export async function getAdminDashboardData(userId) {
  const [requestsSettled, tasksSettled, activitySettled] = await Promise.allSettled([
    projectService.getNewProjectRequests(),
    apiClient.get("/admin/tasks"),
    getActivityEntries(userId),
  ]);

  const requests = requestsSettled.status === "fulfilled" && requestsSettled.value.ok ? requestsSettled.value.data || [] : [];
  const tasks = tasksSettled.status === "fulfilled" ? unwrapList(tasksSettled.value) : [];
  const activity = activitySettled.status === "fulfilled" ? activitySettled.value : [];
  const stats = buildStats(tasks);
  // Show partial warning only when core dashboard sources fail.
  const hasPartialData =
    requestsSettled.status !== "fulfilled" ||
    tasksSettled.status !== "fulfilled" ||
    (requestsSettled.status === "fulfilled" && !requestsSettled.value.ok);

  return {
    stats: [
      { title: "Active Tasks", value: String(stats.total), note: "Across all projects" },
      { title: "Pending Reviews", value: String(stats.inReview), note: "Submitted and waiting" },
      { title: "Approved", value: String(stats.approved), note: "Completed approvals" },
      { title: "New Requests", value: String(requests.length), note: "Awaiting planning" },
    ],
    sideSections: [
      {
        id: "review-queue",
        title: "Review Queue",
        items: tasks
          .filter((task) => task.status === "SUBMITTED")
          .slice(0, 5)
          .map((task) => `${task.title || "Untitled task"} • ${task.projectId || "project"}`),
        emptyText: "No pending review tasks.",
      },
      {
        id: "requests",
        title: "Incoming Requests",
        items: requests.slice(0, 5).map((request) => `${request.title || "Untitled request"} • ${request.status || "REQUESTED"}`),
        emptyText: "No new requests.",
      },
    ],
    activitySection: {
      title: "Recent Activity",
      items: activity.slice(0, 8).map((entry) => entry.message || `${entry.action} • ${entry.target}`),
      emptyText: "No recent activity.",
    },
    trend: {
      labels: ["Assigned", "Submitted", "Revision", "Approved", "Total"],
      values: summarizeTrendFromTasks(tasks),
    },
    lastUpdated: new Date().toISOString(),
    hasPartialData,
  };
}

export async function getEditorDashboardData(userId) {
  const [tasksSettled, notificationsSettled] = await Promise.allSettled([
    projectService.getEditorTasks(userId),
    getNotifications(userId),
  ]);

  const tasks = tasksSettled.status === "fulfilled" && tasksSettled.value.ok ? tasksSettled.value.data || [] : [];
  const notifications = notificationsSettled.status === "fulfilled" ? notificationsSettled.value : [];
  const stats = buildStats(tasks);
  // Notifications are optional for dashboard health and should not trigger partial warning.
  const hasPartialData = tasksSettled.status !== "fulfilled" || (tasksSettled.status === "fulfilled" && !tasksSettled.value.ok);

  return {
    stats: [
      { title: "Assigned Tasks", value: String(stats.total), note: "Current editorial workload" },
      { title: "Pending Review", value: String(stats.inReview), note: "Awaiting admin decision" },
      { title: "Approved", value: String(stats.approved), note: "Ready and accepted" },
      { title: "Needs Revision", value: String(stats.revision), note: "Action required" },
    ],
    sideSections: [
      {
        id: "my-queue",
        title: "Task Queue",
        items: tasks.slice(0, 6).map((task) => `${task.title || "Untitled task"} • ${task.status || "ASSIGNED"}`),
        emptyText: "No tasks assigned.",
      },
      {
        id: "alerts",
        title: "Notification Alerts",
        items: notifications.slice(0, 5).map((note) => note.message || note.title || "Notification"),
        emptyText: "No new alerts.",
      },
    ],
    activitySection: {
      title: "Recent Activity",
      items: notifications.slice(0, 8).map((note) => note.message || note.title || "Notification"),
      emptyText: "No recent updates.",
    },
    trend: {
      labels: ["Assigned", "Submitted", "Revision", "Approved", "Total"],
      values: summarizeTrendFromTasks(tasks),
    },
    lastUpdated: new Date().toISOString(),
    hasPartialData,
  };
}

export async function getStakeholderDashboardData(userId) {
  const [projectsSettled, notificationsSettled] = await Promise.allSettled([
    projectService.getClientProjects(userId),
    getNotifications(userId),
  ]);

  const projects = projectsSettled.status === "fulfilled" && projectsSettled.value.ok ? projectsSettled.value.data || [] : [];
  const notifications = notificationsSettled.status === "fulfilled" ? notificationsSettled.value : [];
  const approved = projects.filter((project) => project.status === "DELIVERED" || project.status === "SIGNED_OFF").length;
  // Notifications are optional for dashboard health and should not trigger partial warning.
  const hasPartialData = projectsSettled.status !== "fulfilled" || (projectsSettled.status === "fulfilled" && !projectsSettled.value.ok);

  return {
    stats: [
      { title: "Total Projects", value: String(projects.length), note: "Projects under your account" },
      { title: "Ready for Review", value: String(projects.filter((project) => project.status === "IN_PROGRESS").length), note: "In active delivery" },
      { title: "Delivered", value: String(approved), note: "Approved and completed" },
      { title: "Notifications", value: String(notifications.length), note: "Latest updates" },
    ],
    sideSections: [
      {
        id: "project-queue",
        title: "Project Queue",
        items: projects.slice(0, 6).map((project) => `${project.title || "Untitled project"} • ${project.status || "REQUESTED"}`),
        emptyText: "No projects found.",
      },
      {
        id: "alerts",
        title: "Approval Alerts",
        items: notifications.slice(0, 5).map((note) => note.message || note.title || "Notification"),
        emptyText: "No pending alerts.",
      },
    ],
    activitySection: {
      title: "Recent Activity",
      items: notifications.slice(0, 8).map((note) => note.message || note.title || "Notification"),
      emptyText: "No recent activity.",
    },
    trend: {
      labels: ["Requested", "In Progress", "Revision", "Delivered", "Signed Off"],
      values: summarizeTrendFromProjects(projects),
    },
    lastUpdated: new Date().toISOString(),
    hasPartialData,
  };
}

export async function getConversationContacts(userId) {
  if (!userId) return [];

  const inbox = await apiClient.get("/messages/inbox");
  return unwrapList(inbox).map((thread) => ({
    key: `${thread.counterpartId}:${thread.projectId || "general"}`,
    name: thread.counterpart?.name || "Conversation",
    email: thread.counterpart?.email || "",
    subtitle: thread.projectTitle || thread.counterpart?.role || "Open thread",
    status: thread.unreadCount > 0 ? "considering" : "active",
    tags: [thread.counterpart?.role || "User"].filter(Boolean),
    messages: [],
    counterpartId: thread.counterpartId,
    projectId: thread.projectId,
    projectTitle: thread.projectTitle,
    lastMessage: thread.lastMessage,
    lastMessageAt: thread.lastMessageAt,
    unreadCount: thread.unreadCount,
  }));
}
