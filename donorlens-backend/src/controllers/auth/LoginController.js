// src/controllers/auth/LoginController.js
// HTTP Controller for login endpoint - handles request/response only

import LoginUsecase from "../../usecases/auth/LoginUsecase.js";
import { getRefreshTokenCookieOptions } from "../../utils/cookie.util.js";

/**
 * Login Controller - Handles HTTP login request
 * Extracts data from request, calls usecase, sets cookies, returns response
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const loginController = async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;

    // Call the login usecase (business logic layer)
    const result = await LoginUsecase(email, password);

    // If login failed, return error response
    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    // Login successful - extract data
    const { accessToken, refreshToken, user } = result.data;

    // Set refresh token in HttpOnly cookie for security
    // This prevents XSS attacks as JavaScript cannot access HttpOnly cookies
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

    // Return success response with access token and user data
    // Access token is sent in response body for client to store in memory
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    console.error("LoginController error:", error);

    // Generic error response - don't leak implementation details
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
