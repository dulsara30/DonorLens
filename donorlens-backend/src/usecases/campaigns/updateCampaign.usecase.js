import Campaign from "../../models/campaigns/Campaign.js";
import User from "../../models/user/User.js";
import {
  NotFoundError,
  ForbiddenError,
  InvalidInputError,
} from "../../utils/errors.js";

export const updateCampaignUsecase = async ({
  userId,
  campaignId,
  updateData,
}) => {

  // Check user
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User");
  }

  if (user.role !== "NGO_ADMIN") {
    throw new ForbiddenError("Only NGO Admin can update campaigns");
  }

  // Find campaign
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    throw new NotFoundError("Campaign");
  }

  // Ownership check
  if (campaign.createdBy.toString() !== userId.toString()) {
    throw new ForbiddenError("You are not allowed to update this campaign");
  }

  // Prevent manual update of restricted fields
  const forbiddenFields = [
    "totalPlannedCost",
    "raisedAmount",
    "status",
    "createdBy",
  ];

  forbiddenFields.forEach((field) => {
    if (field in updateData) {
      delete updateData[field];
    }
  });

  // If financialBreakdown provided, validate
  if (updateData.financialBreakdown) {
    if (!Array.isArray(updateData.financialBreakdown) || updateData.financialBreakdown.length === 0) {
      throw new InvalidInputError("Financial breakdown must be a non-empty array");
    }
    campaign.financialBreakdown = updateData.financialBreakdown;
  }

  // Update other allowed fields
  if (updateData.title !== undefined) {
    campaign.title = updateData.title;
  }

  // Validate end date
  if (updateData.endDate !== undefined) {
    if (new Date(updateData.endDate) <= new Date()) {
      throw new InvalidInputError("End date must be in the future");
    }
  }

  if (updateData.sdgGoalNumber !== undefined) {
    campaign.sdgGoalNumber = updateData.sdgGoalNumber;
  }

  if (updateData.description !== undefined) {
    campaign.description = updateData.description;
  }

  if (updateData.endDate !== undefined) {
    campaign.endDate = updateData.endDate;
  }

  if (updateData.location !== undefined) {
    campaign.location = updateData.location;
  }

  // Save document (pre-save hook recalculates totalPlannedCost + status)
  await campaign.save();

  return campaign;
};