import RejectNgoRequestUsecase from "../../usecases/admin/RejectNgoRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import loggerService from "../../services/logger.service.js";

export default async function RejectNgoRequestController(req, res, next) {
  try {
    loggerService.info("Rejecting NGO Request with details", req.body);
    const { ngoId } = req.params;
    const { note } = req.body;
    const adminId = req.user.userId;

    const ngoData = await RejectNgoRequestUsecase(ngoId, note, adminId);

    if (ngoData.success) {
      return ApiResponse.success(res, {
        message: ngoData.message,
      });
    }
  } catch (error) {
    loggerService.error("Error in RejectNgoRequestController", error);
    next(error);
  }
}
