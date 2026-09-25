import PasswordSetupTokenVerificationUsecase from "../../usecases/admin/PasswordSetupTokenVerificationUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function PasswordSetupTokenVerificationController(
  req,
  res,
  next,
) {
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
    console.error("Something went wrong in the password verification process... ", error);
    next(error);
  }
}
