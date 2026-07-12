import api from './api.js';

export const assetService = {
  async getAll(params = {}) {
    const res = await api.get('/assets', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/assets/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await api.post('/assets', data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/assets/${id}`, data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/assets/${id}`);
    return res;
  },

  async getCategories() {
    const res = await api.get('/categories');
    return res.data;
  },

  async getEmployees() {
    const res = await api.get('/employees');
    return res.data;
  }
};
