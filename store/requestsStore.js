import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import requestsService from '../services/requestsService';

/**
 * Zustand Requests Store with AsyncStorage Persistence
 * 
 * Manages:
 * - Service requests list with pagination
 * - Request creation and status updates
 * - Filter state
 */

const useRequestsStore = create((set, get) => ({
  // State
  requests: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false,
  },
  statusFilter: '',
  isLoading: false,
  error: null,

  /**
   * Fetch consumer's requests
   * @param {number} page - Page number
   * @param {boolean} append - Append to existing requests or replace
   */
  fetchMyRequests: async (page = 1, append = false) => {
    set({ isLoading: true, error: null });
    try {
      const { statusFilter } = get();
      const response = await requestsService.getMyRequests(page, 10, statusFilter);

      const newRequests = append 
        ? [...get().requests, ...response.requests]
        : response.requests;

      set({
        requests: newRequests,
        pagination: response.pagination,
        isLoading: false,
      });

      // Cache requests
      await AsyncStorage.setItem('cached_my_requests', JSON.stringify(newRequests));
    } catch (error) {
      set({ error: error.error || 'Failed to fetch requests', isLoading: false });
    }
  },

  /**
   * Fetch provider's requests
   * @param {number} page - Page number
   * @param {boolean} append - Append to existing requests or replace
   */
  fetchProviderRequests: async (page = 1, append = false) => {
    set({ isLoading: true, error: null });
    try {
      const { statusFilter } = get();
      const response = await requestsService.getProviderRequests(page, 10, statusFilter);

      const newRequests = append 
        ? [...get().requests, ...response.requests]
        : response.requests;

      set({
        requests: newRequests,
        pagination: response.pagination,
        isLoading: false,
      });

      // Cache requests
      await AsyncStorage.setItem('cached_provider_requests', JSON.stringify(newRequests));
    } catch (error) {
      set({ error: error.error || 'Failed to fetch requests', isLoading: false });
    }
  },

  /**
   * Create a service request
   * @param {string} serviceId - Service ID
   * @param {string} providerId - Provider ID
   */
  createRequest: async (serviceId, providerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestsService.createRequest(serviceId, providerId);
      
      // Add new request to the beginning of the list
      set((state) => ({
        requests: [response.request, ...state.requests],
        isLoading: false,
      }));

      return { success: true, request: response.request };
    } catch (error) {
      set({ error: error.error || 'Failed to create request', isLoading: false });
      return { success: false, error };
    }
  },

  /**
   * Update request status (provider only)
   * @param {string} requestId - Request ID
   * @param {string} status - New status
   */
  updateRequestStatus: async (requestId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestsService.updateRequestStatus(requestId, status);
      
      // Update request in the list
      set((state) => ({
        requests: state.requests.map((request) =>
          request._id === requestId ? response.request : request
        ),
        isLoading: false,
      }));

      return { success: true, request: response.request };
    } catch (error) {
      set({ error: error.error || 'Failed to update request', isLoading: false });
      return { success: false, error };
    }
  },

  /**
   * Cancel a request (consumer only)
   * @param {string} requestId - Request ID
   */
  cancelRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      await requestsService.cancelRequest(requestId);
      
      // Update request status in the list
      set((state) => ({
        requests: state.requests.map((request) =>
          request._id === requestId ? { ...request, status: 'cancelled' } : request
        ),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.error || 'Failed to cancel request', isLoading: false });
      return { success: false, error };
    }
  },

  /**
   * Set status filter and reset pagination
   * @param {string} status - Status filter
   */
  setStatusFilter: (status) => {
    set({ statusFilter: status });
  },

  /**
   * Load cached requests from AsyncStorage
   * @param {string} type - 'consumer' or 'provider'
   */
  loadCachedRequests: async (type = 'consumer') => {
    try {
      const key = type === 'consumer' ? 'cached_my_requests' : 'cached_provider_requests';
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        set({ requests: JSON.parse(cached) });
      }
    } catch (error) {
      console.error('Error loading cached requests:', error);
    }
  },

  /**
   * Clear requests and filters
   */
  clearRequests: () => {
    set({
      requests: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasMore: false,
      },
      statusFilter: '',
      error: null,
    });
  },
}));

export default useRequestsStore;
