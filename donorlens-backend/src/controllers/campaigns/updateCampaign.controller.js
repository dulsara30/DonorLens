import mongoose from "mongoose";
import { updateCampaignUsecase } from "../../usecases/campaigns/updateCampaign.usecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { InvalidIdError } from "../../utils/errors.js";

export const updateCampaignController = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { campaignId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new InvalidIdError("Invalid campaign ID format");
    }

    const updateData = req.body;

    const updatedCampaign = await updateCampaignUsecase({
      userId,
      campaignId,
      updateData,
    });

    return ApiResponse.success(res, {
      message: "Campaign updated successfully",
      data: updatedCampaign,
    });

  } catch (error) {
    next(error);
  }
};