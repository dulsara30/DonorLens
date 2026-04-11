import { getAllCampaignsUsecase } from "../../usecases/campaigns/getAllCampaigns.usecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getAllCampaignsController = async (req, res, next) => {
  try {
    const { status, limit } = req.query;

    const campaigns = await getAllCampaignsUsecase({
      status,
      limit,
    });

    return ApiResponse.success(res, {
      statusCode: 200,
      message: "All campaigns retrieved successfully",
      data: campaigns,
    });
  } catch (error) {
    next(error);
  }
};