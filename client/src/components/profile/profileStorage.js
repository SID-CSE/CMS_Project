import apiClient from "../../services/apiClient";
import { roleProfileConfig } from "./roleProfileConfig";

function normalizeProfile(roleKey, profile) {
  const config = roleProfileConfig[roleKey];
  if (!config) return profile || null;

  return {
    ...config.defaultProfile,
    ...(profile || {}),
  };
}

export async function loadRoleProfile(roleKey) {
  const response = await apiClient.get("/users/me");
  const payload = response?.data || response;
  return normalizeProfile(roleKey, payload);
}

export async function saveRoleProfile(roleKey, profile) {
  const response = await apiClient.patch("/users/me", profile);
  const payload = response?.data || response;
  return normalizeProfile(roleKey, payload);
}

export function profileIsEmpty(profile, defaultProfile) {
  const keys = Object.keys(defaultProfile);
  return keys.every((key) => {
    const value = profile?.[key];
    return value === "" || value === null || value === undefined;
  });
}

export function initialsFromProfile(profile) {
  const first = (profile?.firstName || "").trim();
  const last = (profile?.lastName || "").trim();

  if (first || last) {
    return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "CF";
  }

  const email = (profile?.email || "").trim();
  if (email) return email[0].toUpperCase();

  return "CF";
}

export { normalizeProfile };
