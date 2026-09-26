import FetchAllRegisterRequest from "../../usecases/admin/FetchAllRegisterRequestUsecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import loggerService from "../../services/logger.service.js";

export const FetchAllRegisterRequestController = async (req, res, next) => {
  try {
    const ngoData = await FetchAllRegisterRequest();

    return ApiResponse.success(res, {
      data: ngoData,
    });
  } catch (error) {
    loggerService.error("Error fetching NGO registration requests:", error);
    next(error);
  }
};
