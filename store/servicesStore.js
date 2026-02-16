import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import servicesService from '../services/servicesService';

/**
 * Zustand Services Store with Zustand Persist Middleware
 */
const useServicesStore = create(
  persist(
    (set, get) => ({
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
      categories: [],
      isLoading: false,
      error: null,

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
        } catch (error) {
          set({ error: error.error || 'Failed to fetch services', isLoading: false });
        }
      },

      fetchCategories: async () => {
        try {
          const categories = await servicesService.getCategories();
          set({ categories });
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      },

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
        } catch (error) {
          set({ error: error.error || 'Failed to fetch services', isLoading: false });
        }
      },

      createService: async (serviceData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await servicesService.createService(serviceData);
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

      updateService: async (serviceId, serviceData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await servicesService.updateService(serviceId, serviceData);
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

      deleteService: async (serviceId) => {
        set({ isLoading: true, error: null });
        try {
          await servicesService.deleteService(serviceId);
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

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setCategoryFilter: (category) => {
        set({ categoryFilter: category });
      },

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
    }),
    {
      name: 'services-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useServicesStore;
