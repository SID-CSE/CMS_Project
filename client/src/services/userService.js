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
