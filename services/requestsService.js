import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

/**
 * Requests API Service
 * Handles all service request-related API calls
 */

const requestsService = {
  /**
   * Create a service request
   * @param {string} serviceId - Service ID
   * @param {string} providerId - Provider ID
   */
  createRequest: async (serviceId, providerId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.post('/consumer/request', 
        { serviceId, providerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get consumer's requests with pagination and filtering
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} status - Status filter
   */
  getMyRequests: async (page = 1, limit = 10, status = '') => {
    try {
      const token = await AsyncStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) params.append('status', status);

      const response = await api.get(`/consumer/my-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get provider's requests with pagination and filtering
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} status - Status filter
   */
  getProviderRequests: async (page = 1, limit = 10, status = '') => {
    try {
      const token = await AsyncStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) params.append('status', status);

      const response = await api.get(`/provider/requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update request status (provider only)
   * @param {string} requestId - Request ID
   * @param {string} status - New status
   */
  updateRequestStatus: async (requestId, status) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.put('/provider/request-status',
        { requestId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cancel a request (consumer only)
   * @param {string} requestId - Request ID
   */
  cancelRequest: async (requestId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.delete(`/consumer/request/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default requestsService;
