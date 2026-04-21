import api from './api';

export const userService = {
  getUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  createUser: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  lockUser: async (id) => {
    const response = await api.patch(`/users/${id}/lock`);
    return response.data;
  },

  unlockUser: async (id) => {
    const response = await api.patch(`/users/${id}/unlock`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
