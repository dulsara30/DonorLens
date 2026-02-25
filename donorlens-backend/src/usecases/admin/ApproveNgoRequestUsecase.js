import mongoose from "mongoose";
import User from "../../models/user/User.js";
import {
  AnyDuplicationError,
  NotFoundError,
  ValidationError,
} from "../../utils/errors.js";
import SendEmailUsecase from "../email/SendEmailUsecase.js";
import PasswordSetupEmailSendUsecase from "./PasswordSetupEmailSendUsecase.js";

export default async function ApproveNgoRequestUsecase(ngoId, note, adminId) {
  console.log("Approving NGO registration Request!");

  try {
    const error = {};
    if (!ngoId?.trim() || !mongoose.Types.ObjectId.isValid(ngoId))
      error.ngoId = "NGO ID is required";
    if (!adminId?.trim()) error.adminId = "Admin ID is required";
    if (!note?.trim()) error.note = "Approval note is required";

    if (Object.keys(error).length > 0) {
      throw new ValidationError("Missing Required Fields", error);
    }

    const ngoUser = await User.findById(ngoId);

    if (!ngoUser) {
      throw new NotFoundError("NGO");
    }

    const nonApprovableStates = ["APPROVED", "DEACTIVATED"];

    if (
      nonApprovableStates.includes(ngoUser.ngoDetails.status) ||
      ngoUser.isActive
    ) {
      throw new AnyDuplicationError(
        "NGO registration request is already approved",
      );
    }

    if (ngoUser.role !== "NGO_ADMIN") {
      throw new ValidationError("User is not an NGO admin");
    }

    ngoUser.ngoDetails.status = "APPROVED";
    ngoUser.ngoDetails.reviewedAt = new Date();
    ngoUser.ngoDetails.reviewedBy = adminId;

    ngoUser.ngoDetails.reviewNotes.push({
      note: note || "Registration approved",
      createdBy: adminId,
      createdAt: new Date(),
    });

    await ngoUser.save();

    const type = "NGO_REGISTRATION_APPROVED";

    const data = {
      ngoName: ngoUser.ngoDetails.ngoName,
      email: ngoUser.email,
      loginUrl: "https://donorlens.com/login",
    };

    const sendEmail = await SendEmailUsecase({ type, data });

    if (!sendEmail.success) {
      console.error("Failed to send approval email:", sendEmail.error);
    }

    const passwordEmailesult = await PasswordSetupEmailSendUsecase(
      ngoUser._id.toString(),
    );

    if (!passwordEmailesult.success) {
      console.error(
        "Failed to send password setup email:",
        passwordEmailesult.error,
      );
    }

    console.log("NGO registration request approved successfully");

    return {
      success: true,
      message: "NGO registration request approved successfully",
      passwordSetupEmail: passwordEmailesult,
    };
  } catch (error) {
    console.error("Error in ApproveNgoRequestUsecase:", error);
    throw error;
  }
}
