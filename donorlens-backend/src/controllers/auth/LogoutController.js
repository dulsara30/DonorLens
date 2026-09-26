// HTTP Controller for logout endpoint
import User from "../../models/user/User.js";
import { verifyRefreshToken } from "../../utils/jwt.util.js";
import { clearRefreshTokenCookie } from "../../utils/cookie.util.js";
import loggerService from "../../services/logger.service.js";

/**
 * Logout Controller - Clears refresh token cookie and revokes session
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const logoutController = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const decoded = verifyRefreshToken(token);
        const userId = decoded?.userId || decoded?.id;
        if (userId) {
          await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
        }
      } catch (err) {
        /* already invalid or expired - nothing to revoke */
      }
    }

    res.clearCookie("refreshToken", clearRefreshTokenCookie());

    loggerService.logAuth("User logged out, refresh token revoked and cookie cleared");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    loggerService.error("LogoutController error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
