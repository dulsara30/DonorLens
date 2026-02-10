// src/usecases/auth/LoginUsecase.js
// Business logic for user login - validates credentials and generates tokens

import User from "../../models/user/User.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.util.js";

/**
 * Login Usecase - Handles the complete login business logic
 * @param {string} email - User's email address
 * @param {string} password - User's plain text password
 * @returns {Object} Result object with success status, tokens, and user data
 */
export default async function LoginUsecase(email, password) {
  try {
    // Validation: Check if email and password are provided
    if (!email || !password) {
      return {
        success: false,
        status: 400,
        message: "Email and password are required",
      };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        status: 400,
        message: "Invalid email format",
      };
    }

    // Find user by email and explicitly select passwordHash
    // Note: passwordHash has select: false in schema, so we must explicitly include it
    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+passwordHash");

    // Check if user exists
    if (!user) {
      // Generic error message to prevent email enumeration attacks
      return {
        success: false,
        status: 401,
        message: "Invalid email or password",
      };
    }

    // Check if user account is active
    if (!user.isActive) {
      return {
        success: false,
        status: 403,
        message: "Account is deactivated. Please contact support.",
      };
    }

    // Compare provided password with stored hash using bcrypt
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Generic error message to prevent timing attacks
      return {
        success: false,
        status: 401,
        message: "Invalid email or password",
      };
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
    });

    // Return success response with tokens and safe user data
    return {
      success: true,
      status: 200,
      data: {
        accessToken,
        refreshToken,
        user: user.toSafeObject(), // Remove sensitive fields
      },
    };
  } catch (error) {
    console.error("LoginUsecase error:", error);
    
    // Don't leak internal errors to the client
    return {
      success: false,
      status: 500,
      message: "An error occurred during login. Please try again.",
    };
  }
}