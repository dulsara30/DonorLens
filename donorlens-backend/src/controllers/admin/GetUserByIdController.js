import mongoose from "mongoose";
import GetUserByIdUsecase from "../../usecases/admin/GetUserByIdUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { InvalidIdError } from "../../utils/errors.js";

export default async function GetUserByIdController(req, res, next) {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new InvalidIdError("Invalid user ID format");
    }

    const user = await GetUserByIdUsecase(userId);

    return ApiResponse.success(res, {
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
