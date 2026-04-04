const USERS_KEY = "contify_mock_users";
const CURRENT_USER_KEY = "contify_current_user";

function normalizeRole(roleValue) {
  const role = (roleValue || "").toString().trim().toLowerCase();

  if (role === "creator") return "editor";
  if (role === "admin") return "admin";
  if (role === "stakeholder") return "stakeholder";

  return "editor";
}

function getStoredUsers() {
  const raw = localStorage.getItem(USERS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getDashboardPathForRole(roleValue) {
  const role = normalizeRole(roleValue);

  if (role === "admin") return "/admin/dashboard";
  if (role === "stakeholder") return "/stakeholder/home";

  return "/editor/dashboard";
}

export function registerMockUser({ firstName, lastName, email, password, role }) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const users = getStoredUsers();
  const alreadyExists = users.some((user) => user.email === normalizedEmail);

  if (!normalizedEmail || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  if (alreadyExists) {
    return { ok: false, message: "User already exists. Please login." };
  }

  const normalizedRole = normalizeRole(role);
  const user = {
    id: `user-${Date.now()}`,
    firstName: (firstName || "").trim(),
    lastName: (lastName || "").trim(),
    email: normalizedEmail,
    password,
    role: normalizedRole,
    createdAt: new Date().toISOString(),
  };

  saveUsers([user, ...users]);

  localStorage.setItem("selectedRole", normalizedRole);

  return { ok: true, user };
}

export function loginMockUser({ email, password }) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const users = getStoredUsers();

  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user || user.password !== password) {
    return { ok: false, message: "Invalid email or password." };
  }

  localStorage.setItem("userRole", user.role);
  localStorage.setItem("selectedRole", user.role);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  return { ok: true, user };
}
