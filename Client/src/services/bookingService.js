import api from './api.js';

export const bookingService = {
  async getAll() {
    const res = await api.get('/bookings');
    return res.data;
  },

  async getResources() {
    const res = await api.get('/bookings/resources');
    return res.data;
  },

  async create(data) {
    const res = await api.post('/bookings', data);
    return res.data;
  },

  async getSpaceUtilization() {
    const res = await api.get('/bookings/space-utilization');
    return res.data;
  }
};
