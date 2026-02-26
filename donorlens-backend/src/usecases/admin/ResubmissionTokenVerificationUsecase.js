import { ValidationError } from "../../utils/errors.js";
import { verifyResubmissionToken } from "../../utils/jwt.util.js";
import User from "../../models/user/User.js";

export default async function ResubmissionTokenVerificationUsecase(token) {
  try {
    console.log("Verifying resubmission with token....");

    if (!token || typeof token !== "string" || !token.trim()) {
      throw new ValidationError(
        "Token is required and must be a non-empty string",
      );
    }

    const decoded = verifyResubmissionToken(token);

    if (!decoded) {
      throw new ValidationError("Invalid or expired token");
    }

    const ngoUser = await User.findById(decoded.ngoId.toString());

    if (!ngoUser) {
      throw new ValidationError("NGO user not found");
    }

    if (ngoUser.ngoDetails.resubmissionToken !== token) {
      throw new ValidationError("Token has already been used or is invalid");
    }

    if (ngoUser.ngoDetails.resubmissionTokenExpiry < new Date()) {
      throw new ValidationError("Token has expired");
    }

    if (ngoUser.role !== "NGO_ADMIN") {
      throw new ValidationError("User is not an NGO admin");
    }

    if (ngoUser.ngoDetails.resubmissionTokenUsed) {
      throw new ValidationError("Token has already been used");
    }

    if (ngoUser.ngoDetails.status === "APPROVED") {
      throw new ValidationError("NGO is already approved");
    }

    if (ngoUser.isActive === true && ngoUser.passwordHash) {
      throw new ValidationError("NGO user is already active.");
    }

    return {
      success: true,
      message: "Token is valid",
      ngoUser,
    };
  } catch (error) {
    console.error("ResubmissionTokenVerificationUsecase error:", error);
    throw error;
  }
}
