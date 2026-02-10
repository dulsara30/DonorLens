// src/controllers/auth/RefreshTokenController.js
// HTTP Controller for refresh token endpoint

import RefreshTokenUsecase from "../../usecases/auth/RefreshTokenUsecase.js";

/**
 * Refresh Token Controller - Handles refresh token request
 * Reads refresh token from HttpOnly cookie and returns new access token
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const refreshTokenController = async (req, res) => {
  try {
    // Extract refresh token from HttpOnly cookie
    const refreshToken = req.cookies.refreshToken;

    // Call the refresh token usecase
    const result = await RefreshTokenUsecase(refreshToken);

    // If refresh failed, return error response
    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    // Refresh successful - return new access token
    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken: result.data.accessToken,
      },
    });
  } catch (error) {
    console.error("RefreshTokenController error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
