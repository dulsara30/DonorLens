import mongoose from "mongoose";
import User from "../../models/user/User.js";
import {
  AnyDuplicationError,
  NotFoundError,
  ValidationError,
} from "../../utils/errors.js";
import SendEmailUsecase from "../email/SendEmailUsecase.js";
export default async function RejectNgoRequestUsecase(ngoId, note, adminId) {
  console.log("Rejecting NGO registration request!");

  try {
    const error = {};
    if (!ngoId?.trim() || !mongoose.Types.ObjectId.isValid(ngoId))
      error.ngoId = "NGO ID is required";
    if (!adminId?.trim()) error.adminId = "Admin ID is required";
    if (!note?.trim()) error.note = "Reject note is required";

    if (Object.keys(error).length > 0) {
      throw new ValidationError("Missing Required Fields", error);
    }

    const ngoUser = await User.findById(ngoId);

    if (!ngoUser) {
      throw new NotFoundError("NGO");
    }

    const nonApprovableStates = ["REJECTED", "DEACTIVATED"];

    if (nonApprovableStates.includes(ngoUser.ngoDetails.status)) {
      throw new AnyDuplicationError(
        "NGO registration request is already rejected",
      );
    }

    if (ngoUser.isActive) {
      throw new AnyDuplicationError(
        "NGO account is already active. Cannot reject an active account.",
      );
    }

    if (ngoUser.role !== "NGO_ADMIN") {
      throw new ValidationError("User is not an NGO admin");
    }

    ngoUser.ngoDetails.status = "REJECTED";
    ngoUser.ngoDetails.reviewedAt = new Date();
    ngoUser.ngoDetails.reviewedBy = adminId;
    ngoUser.isActive = false;

    ngoUser.ngoDetails.reviewNotes.push({
      note: note || "Registration rejected",
      createdBy: adminId,
      createdAt: new Date(),
    });

    await ngoUser.save();

    const type = "NGO_REGISTRATION_REJECTED";

    const data = {
      ngoName: ngoUser.ngoDetails.ngoName,
      email: ngoUser.email,
      reason: ngoUser.ngoDetails.reviewNotes.slice(-1)[0].note,
    };

    const sendEmailResult = await SendEmailUsecase({ type, data });

    if (!sendEmailResult.success) {
      console.error("Failed to send rejection email:", sendEmailResult.error);
    }
    return {
      success: true,
      message: "NGO registration request rejected successfully",
    };
  } catch (error) {
    console.error("RejectNgoRequestUsecase error:", error);
    throw error;
  }
}
