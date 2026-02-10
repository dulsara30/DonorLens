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
    
    const { userId } = req.user;

    
    const result = await GetCurrentUserUsecase(userId);

    
    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    
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
