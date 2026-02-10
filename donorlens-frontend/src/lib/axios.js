// src/lib/axios.js
// Centralized axios instance with automatic token refresh

import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important: Send cookies with requests
});

// Store for access token and token update function
let accessToken = null;
let tokenUpdateCallback = null;

/**
 * Set access token in memory
 * @param {string} token - Access token
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Get current access token
 * @returns {string|null} Access token
 */
export const getAccessToken = () => {
  return accessToken;
};

/**
 * Register callback to update token in AuthContext
 * @param {Function} callback - Function to call when token is refreshed
 */
export const setTokenUpdateCallback = (callback) => {
  tokenUpdateCallback = callback;
};

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Add request to queue while token is refreshing
 * @param {Function} callback - Request to retry after refresh
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * Execute all queued requests with new token
 * @param {string} token - New access token
 */
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Request Interceptor
 * Automatically attaches access token to requests
 */
api.interceptors.request.use(
  (config) => {
    // Attach access token if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Automatically refreshes access token on 401 errors
 */
api.interceptors.response.use(
  (response) => {
    // Success response, return as is
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to avoid infinite loops
      if (originalRequest.url?.includes("/auth/refresh") || 
          originalRequest.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Attempt to refresh access token using refresh token (in HttpOnly cookie)
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = response.data.data.accessToken;

          // Update token in memory
          setAccessToken(newAccessToken);

          // Update token in AuthContext
          if (tokenUpdateCallback) {
            tokenUpdateCallback(newAccessToken);
          }

          // Retry all queued requests with new token
          onTokenRefreshed(newAccessToken);

          isRefreshing = false;

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - user needs to login again
          isRefreshing = false;
          refreshSubscribers = [];
          
          // Clear token
          setAccessToken(null);
          
          // Optionally redirect to login
          // Note: Better to handle this in AuthContext
          console.error("Token refresh failed:", refreshError);
          
          return Promise.reject(refreshError);
        }
      } else {
        // Token refresh in progress, queue this request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }

    // For other errors, reject normally
    return Promise.reject(error);
  }
);

// Attach interceptors function (for backward compatibility)
export const attachInterceptors = (getAccessToken, setAccessToken) => {
  // This function is kept for compatibility but core logic is now in interceptors above
  console.warn("attachInterceptors is deprecated. Interceptors are automatically configured.");
};

export default api;
