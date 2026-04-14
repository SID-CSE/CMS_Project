import apiClient from "./apiClient";

function unwrapList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function unwrapSingle(response) {
  if (response?.data) return response.data;
  return response;
}

export async function getInboxThreads() {
  const response = await apiClient.get("/messages/inbox");
  return unwrapList(response);
}

export async function getThreadMessages(counterpartId, projectId) {
  const query = new URLSearchParams({ counterpartId });
  if (projectId) query.set("projectId", projectId);
  const response = await apiClient.get(`/messages/threads?${query.toString()}`);
  return unwrapList(response);
}

export async function sendMessage({ recipientId, projectId, taskId, body }) {
  const response = await apiClient.post("/messages", {
    recipientId,
    projectId,
    taskId,
    body,
  });
  return unwrapSingle(response);
}

export async function markThreadRead(counterpartId, projectId) {
  const query = new URLSearchParams({ counterpartId });
  if (projectId) query.set("projectId", projectId);
  const response = await apiClient.patch(`/messages/threads/read?${query.toString()}`, {});
  return unwrapSingle(response);
}

export async function getContacts(roles) {
  const query = roles ? `?roles=${encodeURIComponent(roles)}` : "";
  const response = await apiClient.get(`/users/contacts${query}`);
  return unwrapList(response);
}
