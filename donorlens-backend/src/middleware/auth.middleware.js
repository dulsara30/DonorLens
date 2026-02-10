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
   
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    
    const token = authHeader.substring(7);

 
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

 
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or account deactivated",
      });
    }

  
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
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
  
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }


    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: insufficient permissions",
      });
    }

    next(); 
  };
};
