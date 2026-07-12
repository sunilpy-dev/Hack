import api from './api.js';

export const maintenanceService = {
  async getAll(params = {}) {
    const res = await api.get('/maintenance', { params });
    return res.data;
  },

  async create(data) {
    const res = await api.post('/maintenance', data);
    return res.data;
  },

  async move(id, status) {
    const res = await api.put(`/maintenance/${id}/move`, { status });
    return res.data;
  },

  async generatePreventative() {
    const res = await api.post('/maintenance/generate');
    return res.data;
  },

  async getTechnicians() {
    const res = await api.get('/maintenance/technicians');
    return res.data;
  }
};
