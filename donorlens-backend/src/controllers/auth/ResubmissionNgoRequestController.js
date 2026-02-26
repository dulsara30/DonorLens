import ResubmissionNgoRequestUsecase from "../../usecases/auth/ResubmissionNgoRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { FileValidationError } from "../../utils/errors.js";

export default async function ResubmissionNgoRequestController(req, res, next) {
  try {
    console.log("Received resubmission request with body:", req.body);

    const {
      ngoId,
      ngoName,
      registrationNumber,
      address,
      description,
      officialEmail,
      primaryPhone,
      secondaryPhone,
      website,
    } = req.body;

    const files = req.files;

    // Check if any files were uploaded
    if (!files || Object.keys(files).length === 0) {
      throw new FileValidationError(
        "At least one document is required for NGO registration",
      );
    }

    // Check if registration certificate exists (required)
    if (!files.registrationCertificate) {
      throw new FileValidationError("Registration certificate is required");
    }
    const userData = await ResubmissionNgoRequestUsecase(
      {
        ngoId: ngoId.toString(),
        fullName: ngoName,
        email: officialEmail,
        ngoName,
        registrationNumber,
        primaryPhone,
        secondaryPhone,
        website,
        address,
        description,
      },
      files,
    );

    if (userData.success) {
      return ApiResponse.success(res, {
        message:
          "NGO registration resubmission successful. Waiting for admin approval.",
        data: { user: userData.data },
      });
    }
  } catch (error) {
    console.error("ResubmissionNgoRequestController error:", error.message);
    next(error);
  }
}
