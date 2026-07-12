import api from './api.js';

export const dashboardService = {
  async getStats() {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  async getLogs(limit = 10) {
    const res = await api.get(`/dashboard/logs?limit=${limit}`);
    return res.data;
  }
};
