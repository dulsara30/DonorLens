import mongoose from "mongoose";
import { deleteCampaignUsecase } from "../../usecases/campaigns/deleteCampaign.usecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { InvalidIdError } from "../../utils/errors.js";

export const deleteCampaignController = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { campaignId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new InvalidIdError("Invalid campaign ID format");
    }

    await deleteCampaignUsecase({ userId, campaignId });

    return ApiResponse.success(res, {
      message: "Campaign deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};