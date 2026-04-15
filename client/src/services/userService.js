import apiClient from "./apiClient";

function unwrapSingle(response) {
  if (response?.data) return response.data;
  return response;
}

function unwrapList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export async function getUserProfile(userId) {
  if (!userId) throw new Error("User id is required");
  const response = await apiClient.get(`/users/${encodeURIComponent(userId)}/profile`);
  return unwrapSingle(response);
}

export async function getTeamEditorProfiles() {
  const response = await apiClient.get("/users/team/editors/profiles");
  return unwrapList(response);
}

export async function getMyProfile() {
  const response = await apiClient.get("/users/me");
  return unwrapSingle(response);
}

export async function updateMyProfile(payload) {
  const response = await apiClient.patch("/users/me", payload);
  return unwrapSingle(response);
}

export async function updateEditorProfile(payload) {
  const response = await apiClient.patch("/users/me/editor", payload);
  return unwrapSingle(response);
}

export async function updateMyAvatar(avatarUrl) {
  const response = await apiClient.patch("/users/me/avatar", { avatarUrl });
  return unwrapSingle(response);
}

export async function updateNotificationPrefs(notificationPrefs) {
  const response = await apiClient.patch("/users/me/notifications", { notificationPrefs });
  return unwrapSingle(response);
}

export async function changeMyPassword(payload) {
  const response = await apiClient.patch("/users/me/password", payload);
  return unwrapSingle(response);
}

export async function getEditorStats() {
  const response = await apiClient.get("/editor/stats");
  return unwrapSingle(response);
}
