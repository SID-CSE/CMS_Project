import apiClient from './apiClient';

function unwrapList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

// Notifications Service
export const notificationService = {
  async getUserNotifications(userId) {
    try {
      const response = await apiClient.get(`/notifications?userId=${userId}`);
      return {
        ok: true,
        data: unwrapList(response),
        unreadCount: response.unreadCount || 0,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
        data: [],
        unreadCount: 0,
      };
    }
  },

  async getUnreadNotifications(userId) {
    try {
      const response = await apiClient.get(`/notifications/unread?userId=${userId}`);
      return {
        ok: true,
        data: unwrapList(response),
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
        data: [],
      };
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await apiClient.patch(
        `/notifications/${notificationId}/read`,
        {}
      );
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

  async markAllAsRead(userId) {
    try {
      const response = await apiClient.patch(
        `/notifications/read-all?userId=${userId}`,
        {}
      );
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
};

export default notificationService;
