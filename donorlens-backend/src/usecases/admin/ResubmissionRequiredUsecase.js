import User from "../../models/user/User.js";
import { ValidationError } from "../../utils/errors.js";
import {
  generateResubmissionToken,
  getTokenExpiryDate,
} from "../../utils/jwt.util.js";
import SendEmailUsecase from "../email/SendEmailUsecase.js";

export default async function ResubmissionRequiredUsecase(
  ngoId,
  note,
  adminId,
) {
  try {
    console.log("Initiating resubmission required process for NGO ID:", ngoId);
    if (!ngoId || !ngoId.trim()) {
      throw new ValidationError("NGO ID is required");
    }

    if (!adminId || !adminId.trim()) {
      throw new ValidationError("Admin ID is required");
    }

    const ngoUser = await User.findById(ngoId.trim().toString());

    if (!note.trim() && ngoUser.ngoDetails.status !== "RESUBMIT_REQUIRED") {
      throw new ValidationError("Note for resubmission is required");
    }

    if (!ngoUser) {
      throw new ValidationError("NGO not found");
    }

    if (ngoUser.role !== "NGO_ADMIN") {
      throw new ValidationError("User is not an NGO admin");
    }

    if (ngoUser.ngoDetails.status === "APPROVED" || ngoUser.isActive === true) {
      throw new ValidationError(
        "Cannot request resubmission for an approved NGO",
      );
    }

    ngoUser.ngoDetails.resubmissionToken = null;
    ngoUser.ngoDetails.resubmissionTokenUsed = false;
    ngoUser.ngoDetails.resubmissionTokenExpiry = null;

    await ngoUser.save();

    const ngoData = {
      ngoId: ngoUser._id.toString(),
      email: ngoUser.email,
      registrationNumber: ngoUser.ngoDetails.registrationNumber,
    };

    const resubmissionToken = generateResubmissionToken(ngoData);
    if (!resubmissionToken) {
      return {
        success: false,
        message: "Failed to generate resubmission token",
      };
    }

    ngoUser.ngoDetails.resubmissionToken = resubmissionToken.trim();
    ngoUser.ngoDetails.resubmissionTokenUsed = false;
    ngoUser.ngoDetails.resubmissionTokenExpiry = getTokenExpiryDate();
    ngoUser.ngoDetails.status = "RESUBMIT_REQUIRED";
    ngoUser.isActive = false;
    ngoUser.ngoDetails.reviewNotes.push({
      note: note.trim(),
      createdBy: adminId,
      createdAt: new Date(),
    });

    await ngoUser.save();

    const type = "NGO_REGISTRATION_RESUBMISSION_REQUIRED";
    const resubmissionUrl = `${process.env.CLIENT_URL}/register/ngo?token=${resubmissionToken}`;
    ngoData.resubmissionUrl = resubmissionUrl;
    ngoData.note = note.trim();
    ngoData.expiryHours = 24;
    ngoData.ngoName = ngoUser.ngoDetails.ngoName;

    const emailResult = await SendEmailUsecase({
      type: type,
      data: ngoData,
    });

    if (!emailResult.success) {
      console.error("Failed to send resubmission email:", emailResult.error);
      return {
        success: false,
        message: "Failed to send resubmission email",
        error: emailResult.error,
      };
    }

    return {
      success: true,
      message: "Resubmission email sent successfully",
      data: ngoData,
    };
  } catch (error) {
    console.error("Error in ResubmissionRequiredUsecase:", error);
    throw error;
  }
}
