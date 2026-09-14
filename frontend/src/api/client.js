import axios from 'axios';

export const AUTH_STORAGE_KEY = 'ine-portal-auth';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8787',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export default client;
