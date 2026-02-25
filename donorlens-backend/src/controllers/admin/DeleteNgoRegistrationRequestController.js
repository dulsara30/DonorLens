import DeleteNgoRegistrationRequestUsecase from "../../usecases/admin/DeleteNgoRegistrationRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function DeleteNgoRegistrationRequestController(
  req,
  res,
  next,
) {
  try {
    console.log("Deleting NGO registration request...");
    const { requestId } = req.params;

    const result = await DeleteNgoRegistrationRequestUsecase(requestId);

    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
      });
    } else {
      return ApiResponse.error(res, {
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in DeleteNgoRegistrationRequestController:", error);
    next(error);
  }
}
