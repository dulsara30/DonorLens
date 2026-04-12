import FetchAllUsersUsecase from "../../usecases/admin/FetchAllUsersUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export default async function FetchAllUsersController(req, res, next) {
  try {
    const users = await FetchAllUsersUsecase();

    return ApiResponse.success(res, {
      message: "All users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
