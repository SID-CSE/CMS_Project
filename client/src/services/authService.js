import apiClient from './apiClient';

// Helper to normalize roles
function normalizeRole(roleValue) {
  const role = (roleValue || '').toString().trim().toLowerCase();
  if (role === 'stakeholder') return 'STAKEHOLDER';
  if (role === 'admin') return 'ADMIN';
  if (role === 'editor') return 'EDITOR';
  return 'EDITOR';
}

function getDashboardPathForRole(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'ADMIN') {
    return '/admin/dashboard';
  }

  if (normalizedRole === 'STAKEHOLDER') {
    return '/stakeholder/home';
  }

  return '/editor/dashboard';
}

const CURRENT_USER_KEY = 'contify_current_user';

function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Store user session
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('username', user.username || user.name || '');
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

function clearUserSession() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('username');
  localStorage.removeItem('authToken');
  localStorage.removeItem(CURRENT_USER_KEY);
}

function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;

  const raw = localStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem('currentUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Authentication Service
export const authService = {
  async register({ email, username, name, role, password = 'default123' }) {
    try {
      const response = await apiClient.post('/auth/register', {
        email: (email || '').trim().toLowerCase(),
        username: (username || '').trim(),
        name: (name || username || '').trim(),
        role: normalizeRole(role),
        password,
      });

      const payload = response.data;
      if (payload?.token) {
        localStorage.setItem('authToken', payload.token);
      }
      setCurrentUser(payload?.user);

      return {
        ok: true,
        user: payload?.user,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message || 'Registration failed',
      };
    }
  },

  async login({ email, password }) {
    try {
      const response = await apiClient.post('/auth/login', {
        email: (email || '').trim().toLowerCase(),
        password,
      });

      const payload = response.data;
      if (payload?.token) {
        localStorage.setItem('authToken', payload.token);
      }
      setCurrentUser(payload?.user);

      return {
        ok: true,
        user: payload?.user,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message || 'Login failed',
      };
    }
  },

  async logout() {
    clearUserSession();
    return { ok: true };
  },

  isLoggedIn() {
    return !!getCurrentUser();
  },

  getCurrentUser() {
    return getCurrentUser();
  },

  getUserId() {
    return localStorage.getItem('userId');
  },

  getUserRole() {
    return localStorage.getItem('userRole');
  },

  getDashboardPath() {
    return getDashboardPathForRole(this.getUserRole());
  },
};

export { getDashboardPathForRole, getCurrentUser };
