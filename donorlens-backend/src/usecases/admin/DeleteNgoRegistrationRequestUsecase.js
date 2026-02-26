import User from "../../models/user/User.js";
import { ValidationError } from "../../utils/errors.js";
import SendEmailUsecase from "../email/SendEmailUsecase.js";

export default async function DeleteNgoRegistrationRequestUsecase(ngoId) {
  try {
    if (!ngoId) {
      throw new ValidationError("NGO ID is required");
    }

    const ngoUser = await User.findById(ngoId.toString());

    if (!ngoUser) {
      throw new ValidationError("NGO registration request not found");
    }

    if (ngoUser.role !== "NGO_ADMIN") {
      throw new ValidationError("User is not an NGO admin");
    }

    const deletableStatuses = ["DEACTIVATED", "REJECTED"];
    if (!deletableStatuses.includes(ngoUser.ngoDetails?.status)) {
      throw new ValidationError(
        "Cannot delete NGO registration request with this status",
      );
    }

    const type = "NGO_REGISTRATION_DELETED";
    const emailData = {
      email: ngoUser.email,
      ngoName: ngoUser.ngoDetails?.ngoName || "the NGO",
    };
    await SendEmailUsecase({ type, data: emailData });

    await User.findByIdAndDelete(ngoUser._id.toString());
    return {
      success: true,
      message: "NGO registration request deleted successfully",
    };
  } catch (error) {
    console.error("Error in DeleteNgoRegistrationRequestUsecase:", error);
    throw error;
  }
}
