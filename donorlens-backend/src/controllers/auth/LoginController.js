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
    const { email, password } = req.body;

    const result = await LoginUsecase(email, password);

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    const { accessToken, refreshToken, user } = result.data;

    console.log("Access Token", accessToken);

    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

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

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
