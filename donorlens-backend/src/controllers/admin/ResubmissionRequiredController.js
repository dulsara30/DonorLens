import { ApiResponse } from "../../utils/apiResponse.js";
import ResubmissionRequiredUsecase from "../../usecases/admin/ResubmissionRequiredUsecase.js";

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
    console.error("ResubmissionRequiredController error:", error);
    next(error);
  }
}
