import DeactivateNgoRequestUsecase from "../../usecases/admin/DeactivateNgoRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function DeactivateNgoRequestController(req, res, next) {
  try {
    console.log("Deactivating NGO Request with details", req.body);
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
    console.error("Error in DeactivateNgoRequestController", error);
    next(error);
  }
}
