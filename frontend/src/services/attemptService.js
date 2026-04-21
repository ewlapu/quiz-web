import api from './api';

export const attemptService = {
  submitAttempt: async (data) => {
    const response = await api.post('/attempts', data);
    return response.data;
  },

  getMyAttempts: async (params) => {
    const response = await api.get('/attempts/me', { params });
    return response.data;
  },

  getAttempts: async (params) => {
    const response = await api.get('/attempts', { params });
    return response.data;
  },

  getAttempt: async (id) => {
    const response = await api.get(`/attempts/${id}`);
    return response.data;
  },

  deleteAttempt: async (id) => {
    const response = await api.delete(`/attempts/${id}`);
    return response.data;
  },
};
