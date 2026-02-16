import api from './api';

const notificationService = {
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch notifications';
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to mark notification as read';
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to mark all as read';
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to delete notification';
    }
  },
  registerPushToken: async (token) => {
    try {
      const response = await api.post('/notifications/push-token', { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default notificationService;
