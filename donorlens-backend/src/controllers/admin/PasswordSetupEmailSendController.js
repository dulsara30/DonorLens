import PasswordSetupEmailSendUsecase from "../../usecases/admin/PasswordSetupEmailSendUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import loggerService from "../../services/logger.service.js";

export default async function PasswordSetupEmailSendController(req, res, next) {
  try {
    const { ngoId } = req.params;
    const result = await PasswordSetupEmailSendUsecase(ngoId);

    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
      });
    }
  } catch (error) {
    loggerService.error("Error in PasswordSetupEmailSendController:", error);
    next(error);
  }
}
