import SetPasswordUsecase from "../../usecases/admin/SetPasswordUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function SetPasswordController(req, res, next) {
  try {
    const { token, email, registrationNumber, password, confirmPassword } =
      req.body;

    const result = await SetPasswordUsecase(
      token,
      email,
      registrationNumber,
      password,
      confirmPassword,
    );

    if (!result.success) {
      return ApiResponse.error(res, {
        message: result.message,
      });
    } else {
      return ApiResponse.success(res, {
        message: "Password has been set successfully",
      });
    }
  } catch (error) {
    console.error("Error in SetPasswordController:", error);
    next(error);
  }
}
