// src/usecases/auth/RefreshTokenUsecase.js
// Business logic for refreshing access tokens using refresh token

import User from "../../models/user/User.js";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt.util.js";

/**
 * Refresh Token Usecase - Generates new access token from valid refresh token
 * @param {string} refreshToken - Refresh token from HttpOnly cookie
 * @returns {Object} Result object with success status and new access token
 */
export default async function RefreshTokenUsecase(refreshToken) {
  try {
    // Validation: Check if refresh token is provided
    if (!refreshToken) {
      return {
        success: false,
        status: 401,
        message: "Refresh token required",
      };
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded || !decoded.userId) {
      return {
        success: false,
        status: 401,
        message: "Invalid or expired refresh token",
      };
    }

    // Fetch user from database to ensure they still exist and are active
    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        success: false,
        status: 401,
        message: "User not found",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        status: 403,
        message: "Account is deactivated",
      };
    }

    // Generate new access token with userId and role
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Return success response with new access token
    return {
      success: true,
      status: 200,
      data: {
        accessToken,
      },
    };
  } catch (error) {
    console.error("RefreshTokenUsecase error:", error);
    
    return {
      success: false,
      status: 500,
      message: "Token refresh failed",
    };
  }
}
