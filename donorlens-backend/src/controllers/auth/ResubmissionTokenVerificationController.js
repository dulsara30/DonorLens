import ResubmissionTokenVerificationUsecase from "../../usecases/admin/ResubmissionTokenVerificationUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import loggerService from "../../services/logger.service.js";

export default async function ResubmissionTokenVerificationController(
  req,
  res,
  next,
) {
  try {
    loggerService.info("Received request to verify resubmission token...");
    const { token } = req.query;
    const result = await ResubmissionTokenVerificationUsecase(token);

    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
        data: result.ngoUser,
      });
    }
  } catch (error) {
    loggerService.error("Error in ResubmissionTokenVerificationController:", error);
    next(error);
  }
}
