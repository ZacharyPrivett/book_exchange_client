import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse } from '../types/auth';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7523';

// Requests that should never trigger a token refresh attempt (they either
// don't need auth or are the refresh flow itself, which would otherwise loop).
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the current access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const clearSessionAndRedirectToLogin = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  isRefreshing = false;
  refreshSubscribers = [];

  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    window.location.href = '/';
  }
};

// On a 401, try to use the refresh token to get a new access token and
// transparently retry the original request. If the refresh token is also
// invalid/expired, clear the session and send the user back to login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => originalRequest.url?.includes(endpoint));
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      clearSessionAndRedirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // A refresh is already in flight; wait for it to finish, then retry
      // this request with the new token instead of firing another refresh.
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          api(originalRequest).then(resolve).catch(reject);
        });
      });
    }

    isRefreshing = true;

    try {
      // Use a bare axios call (not the `api` instance) so this request
      // isn't subject to the same interceptors and can't recurse.
      const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      isRefreshing = false;
      onTokenRefreshed(data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearSessionAndRedirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
