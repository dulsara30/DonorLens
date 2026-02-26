import PasswordSetupTokenVerificationUsecase from "../../usecases/admin/PasswordSetupTokenVerificationUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function PasswordSetupTokenVerificationController(
  req,
  res,
  next,
) {
  console.log("verifying password setup token...");
  try {
    const { token } = req.query;

    const result = await PasswordSetupTokenVerificationUsecase(token);

    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
        data: result.data,
      });
    }
  } catch (error) {
    console.error("Error in PasswordSetupTokenVerificationController:", error);
    next(error);
  }
}
