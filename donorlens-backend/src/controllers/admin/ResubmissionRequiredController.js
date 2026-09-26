import { ApiResponse } from "../../utils/apiResponse.js";
import ResubmissionRequiredUsecase from "../../usecases/admin/ResubmissionRequiredUsecase.js";
import loggerService from "../../services/logger.service.js";

export default async function ResubmissionRequiredController(req, res, next) {
  try {
    const { ngoId } = req.params;
    const { note } = req.body;
    const adminId = req.user.userId;

    const result = await ResubmissionRequiredUsecase(ngoId, note, adminId);
    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
        data: result.data,
      });
    }
  } catch (error) {
    loggerService.error("ResubmissionRequiredController error:", error);
    next(error);
  }
}
