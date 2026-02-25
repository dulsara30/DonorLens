import RejectNgoRequestUsecase from "../../usecases/admin/RejectNgoRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function RejectNgoRequestController(req, res, next) {
  try {
    console.log("Rejecting NGO Request with details", req.body);
    const { ngoId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.userId;

    const ngoData = await RejectNgoRequestUsecase(ngoId, reason, adminId);

    if (ngoData.success) {
      return ApiResponse.success(res, {
        message: ngoData.message,
      });
    }
  } catch (error) {
    console.error("Error in RejectNgoRequestController", error);
    next(error);
  }
}
