import User from "../../models/user/User.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import {
  generatePasswordSetupToken,
  getTokenExpiryDate,
} from "../../utils/jwt.util.js";
import SendEmailUsecase from "../email/SendEmailUsecase.js";

export default async function PasswordSetupEmailSendUsecase(ngoId) {
  try {
    console.log("Initiating password setup email send for NGO ID:", ngoId);
    if (!ngoId?.trim()) {
      throw new ValidationError("NGO ID is required");
    }

    const ngo = await User.findById(ngoId);

    if (!ngo) {
      throw new NotFoundError("NGO");
    }

    if (ngo.role !== "NGO_ADMIN") {
      throw new ValidationError("User is not an NGO admin");
    }

    if (ngo.ngoDetails.status !== "APPROVED") {
      throw new ValidationError("NGO is not in approved status");
    }

    if (ngo.ngoDetails.passwordSetupToken) {
      ngo.ngoDetails.passwordSetupToken = null;
      ngo.ngoDetails.passwordSetupTokenExpiry = null;
      ngo.ngoDetails.passwordSetupTokenUsed = false;
      await ngo.save();
    }

    const ngoData = {
      ngoId: ngo._id.toString(),
      email: ngo.email,
      ngoName: ngo.ngoDetails.ngoName,
      registrationNumber: ngo.ngoDetails.registrationNumber,
    };
    const token = await generatePasswordSetupToken(ngoData);

    if (!token) {
      return {
        success: false,
        message: "Failed to generate password setup token",
      };
    }

    ngo.ngoDetails.passwordSetupToken = token;
    ngo.ngoDetails.passwordSetupTokenExpiry = getTokenExpiryDate();
    ngo.ngoDetails.passwordSetupTokenUsed = false;

    await ngo.save();

    const setupUrl = `${process.env.CLIENT_URL}/password-setup?token=${token}`;

    // ✅ Add all required fields for email template
    ngoData.setupUrl = setupUrl;
    ngoData.expiryHours = 24; // ✅ Required by email template

    const emailResult = await SendEmailUsecase({
      type: "NGO_PASSWORD_SETUP",
      data: ngoData,
    });

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send password setup email",
        error: emailResult.error,
      };
    }

    console.log("Password setup email sent successfully to:", ngo.email);

    return {
      success: true,
      message: "Password setup email sent successfully",
      data: ngoData,
    };
  } catch (error) {
    console.error("Error in PasswordSetupEmailSendUsecase:", error);
    throw error;
  }
}
