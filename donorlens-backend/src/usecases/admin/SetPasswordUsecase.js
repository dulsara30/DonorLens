import User from "../../models/user/User.js";
import { ValidationError } from "../../utils/errors.js";
import VerifyIdentityUsecase from "./VerifyIdentityUsecase.js";
import SendEmailUsecase from "../email/SendEmailUsecase.js";

export default async function SetPasswordUsecase(
  token,
  email,
  registrationNumber,
  password,
  confirmPassword,
) {
  try {
    if (!token || !token.trim()) {
      throw new ValidationError("Invalid Session");
    }

    const tokenVerifying3 = await VerifyIdentityUsecase(
      token,
      email,
      registrationNumber,
    );

    if (!tokenVerifying3.success) {
      throw new ValidationError("Invalid Session");
    }

    if (!password || !password.trim()) {
      throw new ValidationError("Password is required");
    } else {
      if (password.length < 8) {
        throw new ValidationError(
          "Password must be at least 8 characters long",
        );
      }
      // Must contain lowercase
      else if (!/(?=.*[a-z])/.test(password)) {
        throw new ValidationError(
          "Password must contain at least one lowercase letter",
        );
      }
      // Must contain uppercase
      else if (!/(?=.*[A-Z])/.test(password)) {
        throw new ValidationError(
          "Password must contain at least one uppercase letter",
        );
      }
      // Must contain number
      else if (!/(?=.*\d)/.test(password)) {
        throw new ValidationError("Password must contain at least one number");
      }
      // Must contain special character
      else if (!/(?=.*[@$!%*?&#])/.test(password)) {
        throw new ValidationError(
          "Password must contain at least one special character",
        );
      }
    }

    if (!confirmPassword || !confirmPassword.trim()) {
      throw new ValidationError("Confirm password is required");
    } else if (password !== confirmPassword) {
      throw new ValidationError("Password and confirm password do not match");
    }

    const ngoUser = await User.findById(tokenVerifying3.data.ngoId.toString());

    if (!ngoUser) {
      throw new ValidationError("NGO user not found");
    }

    ngoUser.passwordHash = password;
    ngoUser.isActive = true;
    ngoUser.ngoDetails.passwordSetupTokenUsed = true;

    await ngoUser.save();

    ngoUser.ngoDetails.passwordSetupToken = null;
    ngoUser.ngoDetails.passwordSetupTokenExpiry = null;
    await ngoUser.save();

    const type = "NGO_PASSWORD_SETUP_SUCCESS";

    const data = {
      ngoName: ngoUser.ngoDetails.ngoName,
      email: ngoUser.email,
    };

    try {
      const emailResult = await SendEmailUsecase({ type, data });
      if (!emailResult.success) {
        console.error(
          "Failed to send password setup confirmation email:",
          emailResult.error,
        );
      }
    } catch (emailError) {
      console.error(
        "Failed to send password setup confirmation email:",
        emailError,
      );
    }

    return {
      success: true,
      message: "Password has been set successfully",
    };
  } catch (error) {
    console.error("Error in SetPasswordUsecase:", error);
    throw error;
  }
}
