import API from './api';

const adminService = {
  getStats: async () => {
    try {
      const response = await API.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch stats';
    }
  },

  getProviders: async (page = 1, limit = 10) => {
    try {
      const response = await API.get(`/admin/providers?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch providers';
    }
  },

  getConsumers: async (page = 1, limit = 10) => {
    try {
      const response = await API.get(`/admin/consumers?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch consumers';
    }
  },

  getServices: async (page = 1, limit = 10) => {
    try {
      const response = await API.get(`/admin/services?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch services';
    }
  },

  approveProvider: async (id) => {
    try {
      const response = await API.put(`/admin/approve/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to approve provider';
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await API.delete(`/admin/user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to delete user';
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await API.put(`/admin/user/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to update user';
    }
  },

  moderateService: async (id, status) => {
    try {
      const response = await API.put(`/admin/services/${id}/moderation`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to moderate service';
    }
  },

  deleteService: async (id) => {
    try {
      const response = await API.delete(`/admin/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to delete service';
    }
  },
  
  createCategory: async (data) => {
    try {
      const response = await API.post('/categories', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to create category';
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await API.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to update category';
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await API.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to delete category';
    }
  }
};

export default adminService;
