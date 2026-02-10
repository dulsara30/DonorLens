// src/middleware/auth.middleware.js
// Authentication middleware to protect routes

import { verifyAccessToken } from "../utils/jwt.util.js";
import User from "../models/user/User.js";

/**
 * Middleware to verify JWT access token from Authorization header
 * Attaches user information to req.user for downstream use
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    // Optionally: Fetch user from database to ensure they still exist and are active
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or account deactivated",
      });
    }

    // Attach user info to request object for use in route handlers
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * Middleware to check if user has required role(s)
 * Must be used after authenticateToken middleware
 * 
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g., ["NGO_ADMIN"])
 * @returns {Function} Express middleware function
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user info exists (should be set by authenticateToken)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: insufficient permissions",
      });
    }

    next(); // User has required role, proceed
  };
};
