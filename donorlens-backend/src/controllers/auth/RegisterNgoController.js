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
    console.error("RegisterNgoController error:", error);

    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
