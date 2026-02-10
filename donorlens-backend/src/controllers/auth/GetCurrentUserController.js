// src/controllers/auth/GetCurrentUserController.js
// HTTP Controller for getting current authenticated user

import GetCurrentUserUsecase from "../../usecases/auth/GetCurrentUserUsecase.js";

/**
 * Get Current User Controller - Returns current user info
 * Requires authentication middleware to be applied
 * 
 * @param {Object} req - Express request object (must have req.user from auth middleware)
 * @param {Object} res - Express response object
 */
export const getCurrentUserController = async (req, res) => {
  try {
    // userId is attached by authenticateToken middleware
    const { userId } = req.user;

    // Call the get current user usecase
    const result = await GetCurrentUserUsecase(userId);

    // If failed, return error response
    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    // Success - return user data
    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("GetCurrentUserController error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
