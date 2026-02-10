import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import servicesService from '../services/servicesService';

/**
 * Zustand Services Store with AsyncStorage Persistence
 * 
 * Manages:
 * - Services list with pagination
 * - Search and filter state
 * - CRUD operations for provider services
 */

const useServicesStore = create((set, get) => ({
  // State
  services: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false,
  },
  searchQuery: '',
  categoryFilter: '',
  isLoading: false,
  error: null,

  /**
   * Fetch all services (consumer view)
   * @param {number} page - Page number
   * @param {boolean} append - Append to existing services or replace
   */
  fetchServices: async (page = 1, append = false) => {
    set({ isLoading: true, error: null });
    try {
      const { searchQuery, categoryFilter } = get();
      const response = await servicesService.getAllServices(
        page,
        10,
        searchQuery,
        categoryFilter
      );

      const newServices = append 
        ? [...get().services, ...response.services]
        : response.services;

      set({
        services: newServices,
        pagination: response.pagination,
        isLoading: false,
      });

      // Cache services
      await AsyncStorage.setItem('cached_services', JSON.stringify(newServices));
    } catch (error) {
      set({ error: error.error || 'Failed to fetch services', isLoading: false });
    }
  },

  /**
   * Fetch provider's services
   * @param {number} page - Page number
   * @param {boolean} append - Append to existing services or replace
   */
  fetchProviderServices: async (page = 1, append = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await servicesService.getProviderServices(page, 10);

      const newServices = append 
        ? [...get().services, ...response.services]
        : response.services;

      set({
        services: newServices,
        pagination: response.pagination,
        isLoading: false,
      });

      // Cache provider services
      await AsyncStorage.setItem('cached_provider_services', JSON.stringify(newServices));
    } catch (error) {
      set({ error: error.error || 'Failed to fetch services', isLoading: false });
    }
  },

  /**
   * Create a new service
   * @param {Object} serviceData - Service details
   */
  createService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await servicesService.createService(serviceData);
      
      // Add new service to the beginning of the list
      set((state) => ({
        services: [response.service, ...state.services],
        isLoading: false,
      }));

      return { success: true, service: response.service };
    } catch (error) {
      set({ error: error.error || 'Failed to create service', isLoading: false });
      return { success: false, error };
    }
  },

  /**
   * Update a service
   * @param {string} serviceId - Service ID
   * @param {Object} serviceData - Updated service details
   */
  updateService: async (serviceId, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await servicesService.updateService(serviceId, serviceData);
      
      // Update service in the list
      set((state) => ({
        services: state.services.map((service) =>
          service._id === serviceId ? response.service : service
        ),
        isLoading: false,
      }));

      return { success: true, service: response.service };
    } catch (error) {
      set({ error: error.error || 'Failed to update service', isLoading: false });
      return { success: false, error };
    }
  },

  /**
   * Delete a service
   * @param {string} serviceId - Service ID
   */
  deleteService: async (serviceId) => {
    set({ isLoading: true, error: null });
    try {
      await servicesService.deleteService(serviceId);
      
      // Remove service from the list
      set((state) => ({
        services: state.services.filter((service) => service._id !== serviceId),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      set({ error: error.error || 'Failed to delete service', isLoading: false });
      return { success: false, error };
    }
  },

  /**
   * Set search query and reset pagination
   * @param {string} query - Search query
   */
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  /**
   * Set category filter and reset pagination
   * @param {string} category - Category filter
   */
  setCategoryFilter: (category) => {
    set({ categoryFilter: category });
  },

  /**
   * Load cached services from AsyncStorage
   */
  loadCachedServices: async () => {
    try {
      const cached = await AsyncStorage.getItem('cached_services');
      if (cached) {
        set({ services: JSON.parse(cached) });
      }
    } catch (error) {
      console.error('Error loading cached services:', error);
    }
  },

  /**
   * Clear services and filters
   */
  clearServices: () => {
    set({
      services: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasMore: false,
      },
      searchQuery: '',
      categoryFilter: '',
      error: null,
    });
  },
}));

export default useServicesStore;
