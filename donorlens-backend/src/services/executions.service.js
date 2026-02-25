import ExecutionUpdate from "../models/campaigns/executions/executions.js";
import Campaign from "../models/campaigns/Campaign.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";

/**
 * Recalculate and update campaign totalUsedAmount and progressPercentage
 * Called after any execution update is created, updated, or deleted
 *
 */

export const recalculateCampaignProgress = async (campaignId) => {
  try {
    //Fetch the campaign
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }

    //Fetch all execution updates for the campaign
    const executionUpdates = await ExecutionUpdate.find({ campaignId });

    //calculate total used amount by summing all fundsUsed
    const totalUsedAmount = executionUpdates.reduce(
      (sum, update) => sum + update.fundsUsed,
      0,
    );

    //validate that totalUsedAmount does not exceed raisedAmount
    if (totalUsedAmount > campaign.raisedAmount) {
      throw new ValidationError(
        `Total used amount (${totalUsedAmount}) cannot exceed raised amount (${campaign.raisedAmount})`,
      );
    }

    //calculate progress percentage using totalPlannedCost
    let progressPercentage = 0;
    if (campaign.totalPlannedCost > 0) {
      progressPercentage = (totalUsedAmount / campaign.totalPlannedCost) * 100;

      //Ensure it does not exceed 100%
      progressPercentage = Math.min(progressPercentage, 100);

      //Round to 2 decimal places
      progressPercentage = Math.round(progressPercentage * 100) / 100;
    }

    //update campaign with new totalUsedAmount and progressPercentage
    campaign.totalUsedAmount = totalUsedAmount;
    campaign.progressPercentage = progressPercentage;

    await campaign.save();

    return campaign;
  } catch (error) {
    console.error("Error recalculating campaign progress:", error);
    throw error;
  }
};
