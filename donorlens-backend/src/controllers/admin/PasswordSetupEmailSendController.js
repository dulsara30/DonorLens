import { ApiResponse } from "../../utils/apiResponse";

export default async function PasswordSetupEmailSendController(req, res, next) {
  try {
    console.log("Sending password setup email");

    const { ngoId } = req.params;
    const result = await PasswordSetupEmailSendUsecase(ngoId);

    if (result.success) {
      return ApiResponse.success(res, {
        message: result.message,
      });
    } else {
      return ApiResponse.error(res, {
        message: result.message,
        statusCode: 400,
      });
    }
  } catch (error) {
    console.error("Error in PasswordSetupEmailSendController:", error);
    next(error);
  }
}
