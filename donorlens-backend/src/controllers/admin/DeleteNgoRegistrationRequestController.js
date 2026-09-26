import DeleteNgoRegistrationRequestUsecase from "../../usecases/admin/DeleteNgoRegistrationRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import loggerService from "../../services/logger.service.js";

export default async function DeleteNgoRegistrationRequestController(
  req,
  res,
  next,
) {
  try {
    const { ngoId } = req.params;
    loggerService.info("Deleting NGO registration request...", { ngoId });

    const result = await DeleteNgoRegistrationRequestUsecase(ngoId);

    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
      });
    }
  } catch (error) {
    loggerService.error("Error in DeleteNgoRegistrationRequestController:", error);
    next(error);
  }
}
