// src/usecases/auth/GetCurrentUserUsecase.js
// Business logic for fetching current authenticated user

import User from "../../models/user/User.js";

/**
 * Get Current User Usecase - Retrieves user information from userId
 * Used for session restoration on frontend refresh
 * @param {string} userId - User's ID from verified JWT token
 * @returns {Object} Result object with success status and user data
 */
export default async function GetCurrentUserUsecase(userId) {
  try {
    // Validation: Check if userId is provided
    if (!userId) {
      return {
        success: false,
        status: 400,
        message: "User ID required",
      };
    }

    // Fetch user from database
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        status: 404,
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

    // Return success response with safe user data
    return {
      success: true,
      status: 200,
      data: {
        user: user.toSafeObject(),
      },
    };
  } catch (error) {
    console.error("GetCurrentUserUsecase error:", error);
    
    return {
      success: false,
      status: 500,
      message: "Failed to fetch user data",
    };
  }
}
