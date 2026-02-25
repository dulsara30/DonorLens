import { ValidationError } from "../../utils/errors.js";
import PasswordSetupTokenVerificationUsecase from "./PasswordSetupTokenVerificationUsecase.js";

export default async function VerifyIdentityUsecase(
  token,
  email,
  registrationNumber,
) {
  try {
    if (!token || !token.trim()) {
      throw new ValidationError("Invalid Session");
    }

    const tokenVerifying = await PasswordSetupTokenVerificationUsecase(token);

    if (!tokenVerifying.success) {
      throw new ValidationError("Invalid Session");
    }

    if (!email || !email.trim()) {
      throw new ValidationError("Email is required");
    } else if (
      email.trim().toLowerCase() !== tokenVerifying.data.email.toLowerCase()
    ) {
      throw new ValidationError(
        "Email does not match with the ngo's registered email",
      );
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new ValidationError("Invalid email format");
    }

    if (!registrationNumber || !registrationNumber.trim()) {
      throw new ValidationError("Registration number is required");
    } else if (
      registrationNumber.trim() !== tokenVerifying.data.registrationNumber
    ) {
      throw new ValidationError(
        "Registration number does not match with the ngo's registered registration number",
      );
    }

    return {
      success: true,
      message: "Identity verified successfully",
      data: {
        email: tokenVerifying.data.email,
        ngoId: tokenVerifying.data.ngoId,
        registrationNumber: tokenVerifying.data.registrationNumber,
        ngoName: tokenVerifying.data.ngoName,
        expiresAt: tokenVerifying.data.expiresAt,
        timeRemainingHours: tokenVerifying.data.timeRemainingHours,
      },
    };
  } catch (error) {
    console.error("Error in VerifyIdentityUsecase:", error);
    throw error;
  }
}
