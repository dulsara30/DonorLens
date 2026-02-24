import ApproveNgoRequestUsecase from "../../usecases/admin/ApproveNgoRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function ApproveNgoRequestController(req, res, next) {
  try {
    console.log("Approving Details", req.body);
    const { ngoId } = req.params;
    const { note } = req.body;
    const adminId = req.user.userId;

    const ngoData = await ApproveNgoRequestUsecase(ngoId, note, adminId);

    if (ngoData.success) {
      return ApiResponse.success(res, {
        message: ngoData.message,
      });
    }
  } catch (error) {
    console.error("Error in ApproveNgoRequestController:", error);
    next(error);
  }
}
