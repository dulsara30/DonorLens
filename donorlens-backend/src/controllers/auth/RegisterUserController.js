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
      
    const { fullName, email, password } = req.body;

    console.log("RegisterUserController received data:", { fullName, email });
    const result = await RegisterUserUsecase({
      fullName,
      email,
      password,
    });

    
    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    
    return res.status(result.status).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("RegisterUserController error:", error);

    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
