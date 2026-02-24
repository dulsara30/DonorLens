import { getMyCampaignsUsecase } from "../../usecases/campaigns/getMyCampaigns.usecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getMyCampaignsController = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    const campaigns = await getMyCampaignsUsecase({ userId });

    return ApiResponse.success(res, {
      statusCode: 200,
      message: "My campaigns retrieved successfully",
      data: campaigns,
    });
  } catch (error) {
    next(error);
  }
};