import DeactivateNgoRequestUsecase from "../../usecases/admin/DeactivateNgoRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import loggerService from "../../services/logger.service.js";

export default async function DeactivateNgoRequestController(req, res, next) {
  try {
    const { ngoId } = req.params;
    const { note } = req.body;
    const adminId = req.user.userId;

    const ngoData = await DeactivateNgoRequestUsecase(ngoId, note, adminId);

    if (ngoData.success) {
      return ApiResponse.success(res, {
        message: ngoData.message,
      });
    }
  } catch (error) {
    loggerService.error("Error in DeactivateNgoRequestController:", error);
    next(error);
  }
}
