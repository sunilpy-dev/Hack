import api from './api.js';

export const auditService = {
  async getAll() {
    const res = await api.get('/audits');
    return res.data;
  },

  async getDiscrepancies() {
    const res = await api.get('/audits/discrepancies');
    return res.data;
  },

  async getDiscrepancyCount() {
    const res = await api.get('/audits/discrepancy-count');
    return res.data;
  }
};
