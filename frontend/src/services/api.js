import axios from 'axios';

// The base Axios instance — all API calls go through this
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Use env variable in production, fallback to /api proxy locally
  withCredentials: true,    // Send cookies (refresh token httpOnly cookie) with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Attach the access token (stored in memory) to every outgoing request
api.interceptors.request.use(
  (config) => {
    // The token is read from the in-memory store (imported lazily to avoid circular deps)
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// If the server returns 401 (expired access token), try to refresh and retry
let isRefreshing = false;
let failedRequestsQueue = []; // Queue of requests waiting for the new token

api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // If we got a 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Guard: don't retry refresh or login endpoints (avoids infinite loops)
      if (originalRequest.url.includes('/auth/refresh-token') ||
          originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another request is already refreshing — queue this one until the new token arrives
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint — refresh token is sent automatically via cookie
        const { data } = await api.post('/auth/refresh-token');
        const newToken = data.data.accessToken;

        // Store the new access token and update this request's header
        setStoredToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Resolve all queued requests with the new token
        failedRequestsQueue.forEach(({ resolve }) => resolve(newToken));
        failedRequestsQueue = [];

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear token and reject all queued requests
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];
        setStoredToken(null);

        // Trigger a logout event so AuthContext can react
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── In-Memory Token Storage ────────────────────────────────────────────────
// Access tokens are stored in memory (NOT localStorage) for security
// They are lost on page refresh, which triggers an automatic token refresh
let accessToken = null;

export const getStoredToken = () => accessToken;
export const setStoredToken = (token) => { accessToken = token; };

export default api;
