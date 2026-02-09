import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

/**
 * Zustand Auth Store with AsyncStorage Persistence
 * 
 * This store manages:
 * - User authentication state
 * - Token persistence
 * - Auto-login on app start
 * - Login/Logout actions
 */

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Loading state for initial auth check

  /**
   * Initialize auth state from AsyncStorage
   * Called when app starts
   */
  initializeAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Login action
   * @param {string} email - User email
   * @param {string} password - User password
   */
  login: async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      // Update store state
      set({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Logout action
   * Clears state and AsyncStorage
   */
  logout: async () => {
    try {
      await authService.logout();
      
      // Clear store state
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error };
    }
  },

  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  updateUser: async (userData) => {
    try {
      const updatedUser = { ...get().user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      set({ user: updatedUser });
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error };
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  checkAuth: () => {
    return get().isAuthenticated;
  },

  /**
   * Get current user
   * @returns {Object|null}
   */
  getUser: () => {
    return get().user;
  },

  /**
   * Get auth token
   * @returns {string|null}
   */
  getToken: () => {
    return get().token;
  },
}));

export default useAuthStore;
