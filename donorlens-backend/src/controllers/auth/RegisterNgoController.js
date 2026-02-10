// src/controllers/auth/RegisterNgoController.js
// HTTP Controller for NGO admin registration endpoint

import RegisterNgoUsecase from "../../usecases/auth/RegisterNgoUsecase.js";

/**
 * Register NGO Admin Controller - Handles HTTP NGO admin registration request
 * Extracts data from request, calls usecase, returns response
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerNgoController = async (req, res) => {
  try {
    // Extract NGO admin registration data from request body
    // Fields are sent flat from frontend for cleaner API
    const { 
      fullName, 
      email, 
      password,
      ngoName,
      registrationNumber,
      contactNumber,
      website,
      address
    } = req.body;

    // Call the register NGO admin usecase (business logic layer)
    const result = await RegisterNgoUsecase({
      fullName,
      email,
      password,
      ngoName,
      registrationNumber,
      contactNumber,
      website,
      address,
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
    console.error("RegisterNgoController error:", error);

    // Generic error response - don't leak implementation details
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
