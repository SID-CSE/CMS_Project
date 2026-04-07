import apiClient from './apiClient';

// Notifications Service
export const notificationService = {
  async getUserNotifications(userId) {
    try {
      const response = await apiClient.get(`/notifications?userId=${userId}`);
      return {
        ok: true,
        data: response.data || [],
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
        `/notifications/mark-all-read?userId=${userId}`,
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
