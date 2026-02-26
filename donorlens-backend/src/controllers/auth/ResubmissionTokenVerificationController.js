import ResubmissionTokenVerificationUsecase from "../../usecases/admin/ResubmissionTokenVerificationUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function ResubmissionTokenVerificationController(
  req,
  res,
  next,
) {
  try {
    console.log("Received request to verify resubmission token...");
    const { token } = req.query;
    const result = await ResubmissionTokenVerificationUsecase(token);

    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
        data: result.ngoUser,
      });
    }
  } catch (error) {
    console.error("Error in ResubmissionTokenVerificationController:", error);
    next(error);
  }
}
