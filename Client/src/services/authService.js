import api from './api.js';

export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res;
  },

  async changePassword(oldPassword, newPassword, userId = null) {
    // If we have a temp token for password reset, it will be attached via api request interceptor.
    // We pass userId if it is forced reset from Login.
    const res = await api.post('/auth/change-password', { oldPassword, newPassword, userId });
    return res;
  },

  async createEmployee(employeeData) {
    const res = await api.post('/auth/create-employee', employeeData);
    return res.data;
  },

  async me() {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      // Clear expired token if call fails
      this.logout();
      throw err;
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
