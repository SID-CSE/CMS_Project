import apiClient from "../../services/apiClient";
import { authService } from "../../services/authService";

function unwrapList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function mapStatus(status) {
  const normalized = (status || "").toString().trim().toUpperCase();
  if (normalized === "SUBMITTED") return "In Review";
  if (normalized === "APPROVED") return "Approved";
  if (normalized === "NEEDS_REVISION" || normalized === "REJECTED") return "Rejected";
  if (normalized === "IN_PROGRESS") return "In Progress";
  return "Draft";
}

function toContentItem(task) {
  return {
    id: task.id,
    title: task.title || "Untitled task",
    owner: task.assignedEditor?.name || task.assignedEditor?.username || task.projectId || "Unassigned",
    summary: task.description || task.adminFeedback || task.latestSubmission?.adminReviewNote || "",
    status: mapStatus(task.status),
    updatedAt: task.updatedAt || task.createdAt || "",
    projectId: task.projectId,
    contentType: task.contentType,
    latestSubmission: task.latestSubmission || null,
  };
}

async function fetchTasksForRole(role, userId) {
  if (role === "admin") {
    const response = await apiClient.get("/admin/tasks");
    return unwrapList(response).map(toContentItem);
  }

  if (role === "editor") {
    const response = await apiClient.get(`/editor/tasks?editorId=${encodeURIComponent(userId)}`);
    return unwrapList(response).map(toContentItem);
  }

  if (role === "stakeholder") {
    const projectsResponse = await apiClient.get(`/projects/stakeholder?stakeholderId=${encodeURIComponent(userId)}`);
    const projects = unwrapList(projectsResponse);
    const taskGroups = await Promise.all(
      projects.map(async (project) => {
        const projectId = project.id || project.projectId;
        if (!projectId) return [];
        const tasksResponse = await apiClient.get(`/projects/${encodeURIComponent(projectId)}/tasks?stakeholderId=${encodeURIComponent(userId)}`);
        return unwrapList(tasksResponse).map(toContentItem);
      })
    );
    return taskGroups.flat();
  }

  return [];
}

async function fetchAuditEntries(userId) {
  if (!userId) return [];

  const response = await apiClient.get(`/notifications?userId=${encodeURIComponent(userId)}`);
  const notifications = unwrapList(response);

  return notifications.map((notification) => ({
    id: notification.id,
    itemTitle: notification.title || notification.type || "Notification",
    message: notification.message || "",
    timestamp: notification.createdAt || notification.timestamp || "",
    actor: notification.type || "System",
    itemId: notification.relatedEntityId || "",
    previousStatus: null,
    nextStatus: notification.type || "",
  }));
}

export function getInitialContentItems(role) {
  return [];
}

export async function loadContentItems(role, context = {}) {
  const userId = context.userId || authService.getUserId();
  return fetchTasksForRole(role, userId);
}

export async function loadAuditLog(role, context = {}) {
  const userId = context.userId || authService.getUserId();
  return fetchAuditEntries(userId);
}

export async function updateContentStatus(role, itemId, nextStatus, actorLabel, context = {}) {
  const userId = context.userId || authService.getUserId();

  if (role !== "admin") {
    throw new Error("Content transitions are only supported for admins in this workflow");
  }

  if (nextStatus === "Approved") {
    await apiClient.patch(`/admin/tasks/${encodeURIComponent(itemId)}/approve`, {});
  } else if (nextStatus === "Rejected" || nextStatus === "Needs Revision") {
    await apiClient.patch(`/admin/tasks/${encodeURIComponent(itemId)}/hold`, {});
  } else {
    throw new Error("Unsupported content transition");
  }

  const items = await loadContentItems(role, { userId });
  const audit = await loadAuditLog(role, { userId });
  return { items, audit };
}

export async function createContentDraft() {
  throw new Error("Draft creation is not supported by the current backend workflow");
}

export const contentRoles = {
  admin: {
    roleLabel: "Admin",
    basePath: "/admin/content",
    nextStep: {
      "In Review": "Approved",
    },
    canReject: true,
    canCreate: false,
    canEditAny: true,
  },
  editor: {
    roleLabel: "Editor",
    basePath: "/editor/content",
    nextStep: {},
    canReject: false,
    canCreate: false,
    canEditAny: false,
  },
  stakeholder: {
    roleLabel: "Stakeholder",
    basePath: "/stakeholder/content",
    nextStep: {},
    canReject: false,
    canCreate: false,
    canEditAny: false,
  },
};
