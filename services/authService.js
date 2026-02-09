import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username (3-20 chars)
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password (8-28 chars with requirements)
   * @param {string} userData.role - User role (consumer or provider)
   * @returns {Promise} Registration response
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Login response with token and user data
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store token and user data
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   * Clears token and user data from storage
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Get current user from storage
   * @returns {Promise<Object|null>} User object or null
   */
  getCurrentUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Check if user is logged in
   * @returns {Promise<boolean>} True if token exists
   */
  isLoggedIn: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Response
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgotPassword', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
