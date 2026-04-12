import User from "../../models/user/User.js";

/**
 * Test Cleanup Controller
 * Deletes test users by email (only for testing purposes)
 * IMPORTANT: Should only be accessible during testing, never in production!
 */

export const deleteTestUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Safety check: only allow test emails to be deleted
    if (!email.includes("test") && !email.includes("test")) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Safety check: Only test emails can be deleted",
      });
    }

    const user = await User.findOneAndDelete({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Test user not found: ${email}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `✅ Test user deleted: ${email}`,
      deletedUser: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Test cleanup error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during test cleanup",
      error: error.message,
    });
  }
};

/**
 * Delete all test NGO users
 * DANGER: Only for testing/development
 */
export const deleteAllTestUsers = async (req, res) => {
  try {
    // Delete all users with test emails
    const result = await User.deleteMany({
      email: { $regex: "test", $options: "i" },
    });

    return res.status(200).json({
      success: true,
      message: `✅ Deleted ${result.deletedCount} test users from database`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ Bulk test cleanup error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during bulk test cleanup",
      error: error.message,
    });
  }
};
