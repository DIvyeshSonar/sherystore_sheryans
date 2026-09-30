import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as loginApi, logout as logoutApi, refreshAccessToken } from '../services/authService';
import { setStoredToken } from '../services/api';

// Create the context
const AuthContext = createContext(null);

// AuthProvider wraps the entire app and manages authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check if user is already logged in

  // On mount, try to restore the session by calling the refresh-token endpoint
  // If the user has a valid refresh token cookie, they get a new access token
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await refreshAccessToken();
        setStoredToken(data.data.accessToken);
        // Now fetch the user profile
        const meData = await getMe();
        setUser(meData.data.user);
      } catch {
        // No valid session — user needs to log in
        setUser(null);
        setStoredToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    // Listen for the auth:logout event (fired by api.js when refresh fails)
    const handleLogout = () => {
      setUser(null);
      setStoredToken(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Login: call API, store access token in memory, set user state
  const login = useCallback(async (credentials) => {
    const data = await loginApi(credentials);
    setStoredToken(data.data.accessToken);
    setUser(data.data.user);
    return data;
  }, []);

  // Logout: call API, clear token, clear user state
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Even if the API call fails, clear local state
    } finally {
      setStoredToken(null);
      setUser(null);
    }
  }, []);

  // Update user data (used by profile page etc.)
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const value = {
    user,           // The authenticated user object (or null)
    loading,        // true while checking session on app start
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy access to auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
