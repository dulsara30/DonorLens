import FetchAllRegisterRequest from "../../usecases/admin/FetchAllRegisterRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const FetchAllRegisterRequestController = async (req, res, next) => {
  try {
    const ngoData = await FetchAllRegisterRequest();

    return ApiResponse.success(res, {
      data: ngoData,
    });
  } catch (error) {
    console.error("Error fetching NGO registration requests:", error);
    next(error);
  }
};
