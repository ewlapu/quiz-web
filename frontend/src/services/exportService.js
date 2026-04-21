import api from './api';

export const exportService = {
  exportUsers: async () => {
    const response = await api.get('/export/users.xlsx', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportExams: async () => {
    const response = await api.get('/export/exams.xlsx', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'exams.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportAttempts: async () => {
    const response = await api.get('/export/attempts.xlsx', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attempts.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
