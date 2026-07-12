import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Something went wrong. Please try again.';
    const status = error.response?.status;
    const responseMsg = error.response?.data?.message;

    if (status === 401) {
      if (error.config?.url?.includes('/login')) {
        message = responseMsg || 'Invalid email or password.';
      } else {
        message = 'Your session has expired. Please login again.';
      }
    } else if (status === 403) {
      message = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      message = 'Requested resource was not found.';
    } else if (status === 409) {
      message = 'Resource already exists.';
    } else if (status === 500) {
      message = 'An unexpected error occurred. Please try again.';
    } else {
      message = responseMsg || error.message || 'Something went wrong. Please try again.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
