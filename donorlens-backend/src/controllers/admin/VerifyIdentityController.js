import VerifyIdentityUsecase from "../../usecases/admin/VerifyIdentityUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import loggerService from "../../services/logger.service.js";

export default async function VerifyIdentityController(req, res, next) {
  loggerService.info("[Step 2 Controller] Verifying user identity...");

  try {
    const { token, email, registrationNumber } = req.body;

    const result = await VerifyIdentityUsecase(
      token,
      email,
      registrationNumber,
    );

    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
        data: result.data,
      });
    }
  } catch (error) {
    loggerService.error("Error in VerifyIdentityController:", error);
    next(error);
  }
}
