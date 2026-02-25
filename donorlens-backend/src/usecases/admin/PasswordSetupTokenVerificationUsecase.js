import { NotFoundError, ValidationError } from "../../utils/errors.js";
import { verifyPasswordSetupToken } from "../../utils/jwt.util.js";
import User from "../../models/user/User.js";

export default async function PasswordSetupTokenVerificationUsecase(token) {
  try {
    if (!token || typeof token !== "string" || !token.trim()) {
      throw new ValidationError(
        "Token is required and must be a non-empty string",
      );
    }

    const decoded = verifyPasswordSetupToken(token);

    if (!decoded) {
      throw new ValidationError("Invalid or expired token");
    }

    const ngoUser = await User.findById(decoded.ngoId);

    if (!ngoUser) {
      throw new NotFoundError("NGO user");
    }

    if (ngoUser.ngoDetails.passwordSetupToken !== token) {
      throw new ValidationError("Token has already been used or is invalid");
    }

    if (ngoUser.ngoDetails.passwordSetupTokenExpiry < new Date()) {
      throw new ValidationError("Token has expired");
    }

    if (ngoUser.ngoDetails.passwordSetupTokenUsed === true) {
      throw new ValidationError("Token has already been used");
    }

    if (ngoUser.role !== "NGO_ADMIN") {
      throw new ValidationError("User is not an NGO admin");
    }

    if (ngoUser.ngoDetails.status !== "APPROVED") {
      throw new ValidationError("NGO is not in approved status");
    }

    if (ngoUser.isActive === true && ngoUser.passwordHash) {
      throw new ValidationError(
        "Password has already been set up for this user",
      );
    }

    return {
      success: true,
      message: "Token is valid",
      data: {
        email: ngoUser.email,
        ngoId: ngoUser._id.toString(),
        registrationNumber: ngoUser.ngoDetails.registrationNumber,
        ngoName: ngoUser.ngoDetails.ngoName,
        expiresAt: ngoUser.ngoDetails.passwordSetupTokenExpiry,
        timeRemainingHours: Math.floor(
          (ngoUser.ngoDetails.passwordSetupTokenExpiry - new Date()) /
            (1000 * 60 * 60),
        ),
      },
    };
  } catch (error) {
    console.error("Error in PasswordSetupTokenVerificationUsecase:", error);
    throw error;
  }
}
