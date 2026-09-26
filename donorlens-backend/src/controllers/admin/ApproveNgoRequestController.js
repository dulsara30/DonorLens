import ApproveNgoRequestUsecase from "../../usecases/admin/ApproveNgoRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import loggerService from "../../services/logger.service.js";

export default async function ApproveNgoRequestController(req, res, next) {
  try {
    const { ngoId } = req.params;
    const { note } = req.body;
    const adminId = req.user.userId;

    loggerService.info("Approving NGO Request", { ngoId, note, adminId });

    const ngoData = await ApproveNgoRequestUsecase(ngoId, note, adminId);

    if (ngoData.success) {
      return ApiResponse.success(res, {
        message: ngoData.message,
      });
    }
  } catch (error) {
    loggerService.error("Error in ApproveNgoRequestController:", error);
    next(error);
  }
}
