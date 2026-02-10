// src/controllers/auth/RegisterUserController.js
// HTTP Controller for normal user (donor) registration endpoint

import RegisterUserUsecase from "../../usecases/auth/RegisterUserUsecase.js";

/**
 * Register User Controller - Handles HTTP user registration request
 * Extracts data from request, calls usecase, returns response
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerUserController = async (req, res) => {
  try {
    // Extract user registration data from request body
    const { fullName, email, password } = req.body;

    console.log("RegisterUserController received data:", { fullName, email });
    // Call the register user usecase (business logic layer)
    const result = await RegisterUserUsecase({
      fullName,
      email,
      password,
    });

    // If registration failed, return error response
    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    // Registration successful - return success response
    return res.status(result.status).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("RegisterUserController error:", error);

    // Generic error response - don't leak implementation details
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
