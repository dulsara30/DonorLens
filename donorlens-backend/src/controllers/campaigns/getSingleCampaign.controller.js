import { getSingleCampaignUsecase } from "../../usecases/campaigns/getSingleCampaign.usecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { InvalidIdError } from "../../utils/errors.js";
import mongoose from "mongoose";

export const getSingleCampaignController = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { campaignId } = req.params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new InvalidIdError("Invalid campaign ID format");
    }

    const campaign = await getSingleCampaignUsecase({
      userId,
      campaignId,
    });

    return ApiResponse.success(res, {
      message: "Campaign retrieved successfully",
      data: campaign,
    });

  } catch (error) {
    next(error);
  }
};