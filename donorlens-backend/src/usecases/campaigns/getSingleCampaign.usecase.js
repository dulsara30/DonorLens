import Campaign from "../../models/campaigns/Campaign.js";
import User from "../../models/user/User.js";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../../utils/errors.js";

export const getSingleCampaignUsecase = async ({ userId, campaignId }) => {
  // Check user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User");
  }

  // Check role
  if (user.role !== "NGO_ADMIN") {
    throw new ForbiddenError("Only NGO Admin can view campaign details");
  }

  // Find campaign
  const campaign = await Campaign.findById(campaignId);

  if (!campaign) {
    throw new NotFoundError("Campaign");
  }

  if (campaign.status === "CANCELLED") {
    throw new ValidationError("Cannot view details of a cancelled campaign");
  }

  // Ownership check
  if (campaign.createdBy.toString() !== userId.toString()) {
    throw new ForbiddenError("You are not allowed to view this campaign");
  }

  return campaign;
};
