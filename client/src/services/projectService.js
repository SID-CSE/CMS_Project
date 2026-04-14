import apiClient from './apiClient';

// Project Service - Handles all workflow operations
export const projectService = {
  // ===== STAGE 1: STAKEHOLDER - Create Project Request =====
  async createProjectRequest({ stakeholderId, clientId, title, description, contentTypes, deadline }) {
    try {
      const requestorId = stakeholderId || clientId;
      const body = {
        title,
        description,
        contentTypes: Array.isArray(contentTypes) ? contentTypes : [contentTypes],
        deadline,
      };

      const response = await apiClient.post(
        `/projects/request?stakeholderId=${requestorId}`,
        body
      );

      return {
        ok: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  // Get projects for stakeholder
  async getClientProjects(clientId) {
    try {
      const response = await apiClient.get(`/projects/stakeholder?stakeholderId=${clientId}`);
      return {
        ok: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
        data: [],
      };
    }
  },

  // Get specific project details
  async getProjectDetails(projectId, clientId) {
    try {
      const response = await apiClient.get(`/projects/${projectId}?stakeholderId=${clientId}`);
      return {
        ok: true,
        data: response.data,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  // ===== STAGE 2: ADMIN - Create Project Plan =====
  async createProjectPlan(projectId, adminId, { timelineStart, timelineEnd, notes, milestones }) {
    try {
      const body = {
        timelineStart,
        timelineEnd,
        notes,
        milestones: milestones || [],
      };

      const response = await apiClient.post(
        `/admin/projects/${projectId}/plan?adminId=${adminId}`,
        body
      );

      return {
        ok: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  // Get all new project requests (for admin)
  async getNewProjectRequests() {
    try {
      const response = await apiClient.get('/admin/requests');
      return {
        ok: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
        data: [],
      };
    }
  },

  // Get project with admin detail view
  async getAdminProjectDetail(projectId) {
    try {
      const response = await apiClient.get(`/admin/projects/${projectId}`);
      return {
        ok: true,
        data: response.data,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  // ===== STAGE 2: ADMIN - Send Plan to Stakeholder =====
  async sendPlanToClient(projectId, adminId) {
    try {
      const response = await apiClient.patch(
        `/admin/projects/${projectId}/plan/send?adminId=${adminId}`,
        {}
      );

      return {
        ok: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  // ===== STAGE 3: STAKEHOLDER - Accept Plan =====
  async acceptProjectPlan(projectId, clientId) {
    try {
      const response = await apiClient.patch(
        `/projects/${projectId}/accept?stakeholderId=${clientId}`,
        {}
      );

      return {
        ok: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  // ===== STAGE 3: STAKEHOLDER - Request Changes =====
  async requestPlanChanges(projectId, clientId, feedback) {
    try {
      const body = { feedback };

      const response = await apiClient.patch(
        `/projects/${projectId}/feedback?stakeholderId=${clientId}`,
        body
      );

      return {
        ok: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  // Get project plan (for stakeholder approval)
  async getProjectPlan(projectId, clientId) {
    try {
      const endpoint = clientId
        ? `/projects/${projectId}/plan?stakeholderId=${clientId}`
        : `/projects/${projectId}/plan`;
      const response = await apiClient.get(endpoint);
      return {
        ok: true,
        data: response.data,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  // ===== STAGE 4: ADMIN - CREATE TASKS =====
  async createTask(projectId, adminId, payload) {
    try {
      const response = await apiClient.post(
        `/admin/projects/${projectId}/tasks?adminId=${adminId}`,
        payload
      );
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  async getProjectTasksForAdmin(projectId) {
    try {
      const response = await apiClient.get(`/admin/projects/${projectId}/tasks`);
      return { ok: true, data: response.data || [] };
    } catch (error) {
      return { ok: false, data: [], message: error.message };
    }
  },

  async getEditors() {
    try {
      const response = await apiClient.get('/users/editors');
      return { ok: true, data: response.data || [] };
    } catch (error) {
      return { ok: false, data: [], message: error.message };
    }
  },

  // ===== STAGE 5: EDITOR - SUBMIT WORK =====
  async getEditorTasks(editorId) {
    try {
      const endpoint = editorId ? `/editor/tasks?editorId=${editorId}` : '/editor/tasks';
      const response = await apiClient.get(endpoint);
      return { ok: true, data: response.data || [] };
    } catch (error) {
      return { ok: false, data: [], message: error.message };
    }
  },

  async submitTask(taskId, editorId, payload) {
    try {
      const body = payload ?? editorId;
      const endpoint = payload
        ? `/editor/tasks/${taskId}/submit?editorId=${editorId}`
        : `/editor/tasks/${taskId}/submit`;
      const response = await apiClient.post(
        endpoint,
        body
      );
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  // ===== STAGE 6: ADMIN - REVIEW SUBMISSIONS =====
  async reviewTask(taskId, adminId, payload) {
    try {
      const response = await apiClient.patch(
        `/admin/tasks/${taskId}/review?adminId=${adminId}`,
        payload
      );
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  // ===== STAGE 7: STAKEHOLDER - DELIVERY SIGN-OFF =====
  async getStakeholderProjectTasks(projectId, clientId) {
    try {
      const response = await apiClient.get(`/projects/${projectId}/tasks?stakeholderId=${clientId}`);
      return { ok: true, data: response.data || [] };
    } catch (error) {
      return { ok: false, data: [], message: error.message };
    }
  },

  async reviewStakeholderTask(taskId, clientId, payload) {
    try {
      const response = await apiClient.patch(
        `/projects/tasks/${taskId}/review?stakeholderId=${clientId}`,
        payload
      );
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  async signOffDelivery(projectId, clientId, payload = {}) {
    try {
      const response = await apiClient.patch(`/projects/${projectId}/signoff?stakeholderId=${clientId}`, payload);
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  async updateProjectStatus(projectId, newStatus, adminId) {
    try {
      const endpoint = adminId
        ? `/admin/projects/${projectId}/status?adminId=${adminId}`
        : `/admin/projects/${projectId}/status`;
      const response = await apiClient.patch(endpoint, { status: newStatus });
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  async getAllProjects() {
    try {
      const response = await apiClient.get('/admin/projects');
      return { ok: true, data: response.data || [] };
    } catch (error) {
      return { ok: false, data: [], message: error.message };
    }
  },

  // ===== STREAMING HELPERS =====
  async getAdminTasks() {
    try {
      const response = await apiClient.get('/admin/tasks');
      return { ok: true, data: response.data || [] };
    } catch (error) {
      return { ok: false, data: [], message: error.message };
    }
  },

  async getAdminTaskSubmissions(taskId) {
    try {
      const response = await apiClient.get(`/admin/tasks/${taskId}/submissions`);
      return { ok: true, data: response.data || [] };
    } catch (error) {
      return { ok: false, data: [], message: error.message };
    }
  },

  async getAdminSubmissionMediaUrl(submissionId) {
    try {
      const response = await apiClient.get(`/admin/tasks/submissions/${submissionId}/media-url`);
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  async getAdminTaskStreamUrl(taskId) {
    try {
      const response = await apiClient.get(`/admin/tasks/${taskId}/stream-url`);
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  async approveAdminTask(taskId) {
    try {
      const response = await apiClient.patch(`/admin/tasks/${taskId}/approve`, {});
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  async holdAdminTask(taskId) {
    try {
      const response = await apiClient.patch(`/admin/tasks/${taskId}/hold`, {});
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  async forwardAdminTask(taskId) {
    try {
      const response = await apiClient.patch(`/admin/tasks/${taskId}/forward`, {});
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },

  async getStakeholderTaskStreamUrl(taskId) {
    try {
      const response = await apiClient.get(`/stakeholder/tasks/${taskId}/stream-url`);
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },
};

export default projectService;
