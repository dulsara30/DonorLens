// Business logic for refreshing access tokens using refresh token

import User from "../../models/user/User.js";
import {
  generateAccessToken,
  verifyRefreshToken,
} from "../../utils/jwt.util.js";
import loggerService from "../../services/logger.service.js";

/**
 * Refresh Token Usecase - Generates new access token from valid refresh token
 * @param {string} refreshToken - Refresh token from HttpOnly cookie
 * @returns {Object} Result object with success status and new access token
 */
export default async function RefreshTokenUsecase(refreshToken) {
  try {
    if (!refreshToken) {
      return {
        success: false,
        status: 401,
        message: "Refresh token required",
      };
    }

    const decoded = verifyRefreshToken(refreshToken);

    const userId = decoded.userId || decoded.id;

    if (!decoded || !userId) {
      return {
        success: false,
        status: 401,
        message: "Invalid or expired refresh token",
      };
    }

    const user = await User.findById(userId);

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

    if (decoded.tv === undefined || decoded.tv !== (user.tokenVersion || 0)) {
      return {
        success: false,
        status: 401,
        message: "Session expired. Please log in again.",
      };
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
      tv: user.tokenVersion || 0,
    });

    return {
      success: true,
      status: 200,
      data: {
        accessToken,
      },
    };
  } catch (error) {
    loggerService.error("RefreshTokenUsecase error:", error);

    return {
      success: false,
      status: 500,
      message: "Token refresh failed",
    };
  }
}
