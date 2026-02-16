import api from './api';

/**
 * Media API Service
 * Handles uploading images to the backend (and then to Cloudinary)
 */
const mediaService = {
  /**
   * Upload a single image
   * @param {string} uri - Local file URI from image picker
   */
  uploadSingle: async (uri) => {
    try {
      const formData = new FormData();
      
      // Get filename and extension
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', {
        uri,
        name: filename,
        type,
      });

      const response = await api.post('/media/upload-single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Single upload error (FULL):', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      throw error.response?.data?.error || 'Failed to upload image: ' + (error.message || 'Unknown error');
    }
  },

  /**
   * Upload multiple images
   * @param {string[]} uris - Array of local file URIs
   */
  uploadMultiple: async (uris) => {
    try {
      const formData = new FormData();
      
      uris.forEach((uri, index) => {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('images', {
          uri,
          name: filename,
          type,
        });
      });

      const response = await api.post('/media/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Multi upload error (FULL):', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      throw error.response?.data?.error || 'Failed to upload images: ' + (error.message || 'Unknown error');
    }
  },

  /**
   * Delete an image
   * @param {string} publicId - Cloudinary public ID
   */
  deleteImage: async (publicId) => {
    try {
      const response = await api.post('/media/delete', { public_id: publicId });
      return response.data;
    } catch (error) {
      console.error('Delete image error:', error);
      throw error.response?.data?.error || 'Failed to delete image';
    }
  },
};

export default mediaService;
