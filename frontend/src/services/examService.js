import api from './api';

export const examService = {
  getExams: async (params) => {
    const response = await api.get('/exams', { params });
    return response.data;
  },

  getPublicExams: async (params) => {
    const response = await api.get('/exams/public', { params });
    return response.data;
  },

  getPublicExam: async (id) => {
    const response = await api.get(`/exams/${id}/public`);
    return response.data;
  },

  createExam: async (data) => {
    const response = await api.post('/exams', data);
    return response.data;
  },

  updateExam: async (id, data) => {
    const response = await api.put(`/exams/${id}`, data);
    return response.data;
  },

  publishExam: async (id) => {
    const response = await api.patch(`/exams/${id}/publish`);
    return response.data;
  },

  unpublishExam: async (id) => {
    const response = await api.patch(`/exams/${id}/unpublish`);
    return response.data;
  },

  deleteExam: async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },
};
