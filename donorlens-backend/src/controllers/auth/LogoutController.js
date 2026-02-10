// HTTP Controller for logout endpoint

/**
 * Logout Controller - Clears refresh token cookie
 * No usecase needed - just cookie management
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const logoutController = async (req, res) => {
  try {
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    console.log("User logged out, refresh token cookie cleared");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("LogoutController error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
