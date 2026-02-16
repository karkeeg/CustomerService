import { create } from 'zustand';
import notificationService from '../services/notificationService';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,

  fetchNotifications: async (loadMore = false) => {
    if (loadMore && (!get().hasMore || get().isLoading)) return;
    
    const nextPage = loadMore ? get().page + 1 : 1;
    set({ isLoading: true, error: null });
    
    try {
      const data = await notificationService.getNotifications(nextPage);
      set((state) => ({ 
        notifications: loadMore ? [...state.notifications, ...data.notifications] : data.notifications, 
        unreadCount: data.unreadCount,
        page: nextPage,
        hasMore: data.pagination.hasMore,
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error, isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },

  deleteNotification: async (id) => {
    try {
      const notification = get().notifications.find(n => n._id === id);
      const unreadAdjustment = notification && !notification.isRead ? 1 : 0;
      
      await notificationService.deleteNotification(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
        unreadCount: Math.max(0, state.unreadCount - unreadAdjustment),
      }));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },
}));

export default useNotificationStore;
