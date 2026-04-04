import { roleProfileConfig } from "./roleProfileConfig";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function readRoleProfile(roleKey) {
  const config = roleProfileConfig[roleKey];
  if (!config) return null;

  const raw = localStorage.getItem(config.storageKey);
  const parsed = raw ? safeJsonParse(raw) : null;

  return {
    ...config.defaultProfile,
    ...(parsed || {}),
  };
}

export function saveRoleProfile(roleKey, profile) {
  const config = roleProfileConfig[roleKey];
  if (!config) return;

  const payload = {
    ...config.defaultProfile,
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(config.storageKey, JSON.stringify(payload));
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
