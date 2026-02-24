import User from "../../models/user/User";
import { NotFoundError, ValidationError } from "../../utils/errors";
import {
  generatePasswordSetupToken,
  getTokenExpiryDate,
} from "../../utils/jwt.util";
import SendEmailUsecase from "../email/SendEmailUsecase";

export default async function PasswordSetupEmailSendUsecase(ngoId) {
  try {
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
      ngoID: ngo._id.toString(),
      email: ngo.email,
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

    ngoData.setupUrl = setupUrl;

    const emailResult = await SendEmailUsecase("NGO_PASSWORD_SETUP", ngoData);

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send password setup email",
        error: emailResult.error,
      };
    }

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
