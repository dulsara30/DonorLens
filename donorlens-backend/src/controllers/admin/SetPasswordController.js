import SetPasswordUsecase from "../../usecases/admin/SetPasswordUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import loggerService from "../../services/logger.service.js";

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

    if (result.success) {
      return ApiResponse.success(res, {
        message: "Password has been set successfully",
      });
    }
  } catch (error) {
    loggerService.error("Error in SetPasswordController:", error);
    next(error);
  }
}
