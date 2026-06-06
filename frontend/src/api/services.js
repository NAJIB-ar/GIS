import api from './axios';

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (data) => api.post('/register', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

export const reportService = {
  getAll: (params = {}) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  create: (formData) =>
    api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (id, status) => api.put(`/reports/${id}/status`, { status }),
  delete: (id) => api.delete(`/reports/${id}`),
};

export const providerService = {
  getAll: () => api.get('/providers'),
  create: (data) => api.post('/providers', data),
  update: (id, data) => api.put(`/providers/${id}`, data),
  delete: (id) => api.delete(`/providers/${id}`),
};
