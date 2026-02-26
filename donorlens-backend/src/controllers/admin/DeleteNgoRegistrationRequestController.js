import DeleteNgoRegistrationRequestUsecase from "../../usecases/admin/DeleteNgoRegistrationRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function DeleteNgoRegistrationRequestController(
  req,
  res,
  next,
) {
  try {
    console.log("Deleting NGO registration request...");
    const { ngoId } = req.params;

    const result = await DeleteNgoRegistrationRequestUsecase(ngoId);

    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in DeleteNgoRegistrationRequestController:", error);
    next(error);
  }
}
