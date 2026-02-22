import RegisterNgoUsecase from "../../usecases/auth/RegisterNgoUsecase.js";
import { FileValidationError } from "../../utils/errors.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const adminRegisterController = async (req, res, next) => {
  try {
    console.log("📝 AdminRegisterController called");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const {
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

    const userData = await RegisterNgoUsecase(
      {
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
      files, // Pass files to usecase
    );

    console.log("NGO admin registered:", userData.email);

    return ApiResponse.created(res, {
      message:
        "NGO registration submitted successfully. Waiting for admin approval.",
      data: {
        user: userData,
      },
    });
  } catch (error) {
    console.error(" AdminRegisterController error:", error.message);
    next(error);
  }
};
