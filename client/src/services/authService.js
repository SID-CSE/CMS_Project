import apiClient from './apiClient';

// Helper to normalize roles
function normalizeRole(roleValue) {
  const role = (roleValue || '').toString().trim().toUpperCase();
  if (role === 'STAKEHOLDER' || role === 'ADMIN' || role === 'EDITOR') {
    return role;
  }
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

// Store user session
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('username', user.username || '');
  }
}

function clearUserSession() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('username');
  localStorage.removeItem('authToken');
}

function getCurrentUser() {
  const raw = localStorage.getItem('currentUser');
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
        email,
        username,
        name,
        role: normalizeRole(role),
        password,
      });

      const payload = response.data;
      setCurrentUser(payload.user);
      localStorage.setItem('authToken', payload.token);

      return {
        ok: true,
        user: payload.user,
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
        email,
        password,
      });

      const payload = response.data;
      setCurrentUser(payload.user);
      localStorage.setItem('authToken', payload.token);

      return {
        ok: true,
        user: payload.user,
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
