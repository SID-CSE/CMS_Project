import apiClient from './apiClient';

// Project Service - Handles all workflow operations
export const projectService = {
  // ===== STAGE 1: STAKEHOLDER - Create Project Request =====
  async createProjectRequest({ clientId, title, description, contentTypes, deadline }) {
    try {
      const body = {
        title,
        description,
        contentTypes: Array.isArray(contentTypes) ? contentTypes : [contentTypes],
        deadline,
      };

      const response = await apiClient.post(
        `/projects/request?clientId=${clientId}`,
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
      const response = await apiClient.get(`/projects/client?clientId=${clientId}`);
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
      const response = await apiClient.get(`/projects/${projectId}?clientId=${clientId}`);
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

  // ===== STAGE 2: ADMIN - Send Plan to Client =====
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
        `/projects/${projectId}/accept?clientId=${clientId}`,
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
        `/projects/${projectId}/feedback?clientId=${clientId}`,
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
        ? `/projects/${projectId}/plan?clientId=${clientId}`
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
      const response = await apiClient.get(`/editor/tasks?editorId=${editorId}`);
      return { ok: true, data: response.data || [] };
    } catch (error) {
      return { ok: false, data: [], message: error.message };
    }
  },

  async submitTask(taskId, editorId, payload) {
    try {
      const response = await apiClient.post(
        `/editor/tasks/${taskId}/submit?editorId=${editorId}`,
        payload
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
      const response = await apiClient.get(`/projects/${projectId}/tasks?clientId=${clientId}`);
      return { ok: true, data: response.data || [] };
    } catch (error) {
      return { ok: false, data: [], message: error.message };
    }
  },

  async signOffDelivery(projectId, clientId) {
    try {
      const response = await apiClient.patch(`/projects/${projectId}/signoff?clientId=${clientId}`, {});
      return { ok: true, data: response.data, message: response.message };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },
};

export default projectService;
