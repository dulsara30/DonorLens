// src/utils/cookie.util.js
// Cookie configuration utilities for secure token storage

/**
 * Get cookie options for refresh token
 * HttpOnly ensures the cookie cannot be accessed by JavaScript (XSS protection)
 * Secure ensures the cookie is only sent over HTTPS in production
 * SameSite prevents CSRF attacks
 * 
 * @returns {Object} Cookie configuration options
 */
export const getRefreshTokenCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

  return {
    httpOnly: true, // Prevents client-side JavaScript access (XSS protection)
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "strict" : "lax", // CSRF protection
    maxAge, // Cookie expiry time
    path: "/", // Cookie available across entire domain
  };
};

/**
 * Clear refresh token cookie
 * @returns {Object} Cookie options to clear the token
 */
export const clearRefreshTokenCookie = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 0, // Expire immediately
    path: "/",
  };
};
