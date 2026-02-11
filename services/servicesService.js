import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

/**
 * Services API Service
 * Handles all service-related API calls
 */

const servicesService = {
  /**
   * Get all services with pagination, search, and filtering
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} search - Search query
   * @param {string} category - Category filter
   */
  getAllServices: async (page = 1, limit = 10, search = '', category = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const response = await api.get(`/consumer/services?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get provider's services with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getProviderServices: async (page = 1, limit = 10) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get(`/provider/services?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new service
   * @param {Object} serviceData - Service details
   */
  createService: async (serviceData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.post('/provider/service', serviceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update a service
   * @param {string} serviceId - Service ID
   * @param {Object} serviceData - Updated service details
   */
  updateService: async (serviceId, serviceData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.put(`/provider/service/${serviceId}`, serviceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a service
   * @param {string} serviceId - Service ID
   */
  deleteService: async (serviceId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.delete(`/provider/service/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default servicesService;
