import api from './api';

// All auth-related API calls

// Register a new user
export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

// Login and get access token + user
export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

// Get a new access token using the refresh token cookie
export const refreshAccessToken = async () => {
  const { data } = await api.post('/auth/refresh-token');
  return data;
};

// Logout — invalidates refresh token on server and clears cookie
export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

// Get the currently logged-in user's profile
export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
