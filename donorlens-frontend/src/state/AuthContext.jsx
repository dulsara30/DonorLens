// Global authentication state management with automatic token refresh

import { createContext, useState, useEffect, useCallback } from "react";
import api, { setAccessToken as setAxiosAccessToken, setTokenUpdateCallback } from "../lib/axios";

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages authentication state globally
 * - Stores user info and access token in memory (NOT localStorage)
 * - Automatically restores session on page refresh
 * - Provides login/logout methods
 */
export function AuthProvider({ children }) {
  // Authentication state
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Restore session on app load
   * Fetches current user from backend using refresh token (HttpOnly cookie)
   */
  const restoreSession = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to get current user using refresh token from cookie
      // Backend will validate the refresh token and return user data
      const response = await api.get("/auth/me");
      
      if (response.data.success && response.data.data.user) {
        const userData = response.data.data.user;
        console.log("Session restored for user:", userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Note: Access token is automatically set by axios interceptor
        // when /auth/refresh is called internally
      }
    } catch (error) {
      // Session restoration failed (no valid refresh token or expired)
      console.log("Session restoration failed:", error.response?.data?.message || error.message);
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  /**
   * Login method
   * Called after successful login from LoginCard
   * @param {Object} userData - User object with role
   * @param {string} token - Access token
   */
  const login = useCallback((userData, token) => {
    setUser(userData);
    setAccessToken(token);
    setIsAuthenticated(true);
  }, []);

  /**
   * Logout method
   * Clears local state and backend refresh token cookie
   */
  const logout = useCallback(async () => {
    try {
      // Call backend logout to clear refresh token cookie
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear frontend state regardless of backend response
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  /**
   * Update access token
   * Called by axios interceptor after token refresh
   */
  const updateAccessToken = useCallback((token) => {
    setAccessToken(token);
    setAxiosAccessToken(token);
  }, []);

  // Connect axios interceptor with AuthContext
  // This allows axios to update the token in AuthContext when it refreshes
  useEffect(() => {
    setTokenUpdateCallback(updateAccessToken);
  }, [updateAccessToken]);

  const value = {
    // State
    user,
    accessToken,
    isAuthenticated,
    loading,
    role: user?.role || null,
    
    // Methods
    login,
    logout,
    updateAccessToken,
    restoreSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
