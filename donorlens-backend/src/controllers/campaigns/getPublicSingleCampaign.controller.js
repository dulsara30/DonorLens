import mongoose from "mongoose";
import { getPublicSingleCampaignUsecase } from "../../usecases/campaigns/getPublicSingleCampaign.usecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { InvalidIdError } from "../../utils/errors.js";

export const getPublicSingleCampaignController = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new InvalidIdError("Invalid campaign ID format");
    }

    const campaign = await getPublicSingleCampaignUsecase({ campaignId });

    return ApiResponse.success(res, {
      statusCode: 200,
      message: "Public campaign retrieved successfully",
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
};