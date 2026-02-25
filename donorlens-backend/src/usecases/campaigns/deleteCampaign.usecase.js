import Campaign from "../../models/campaigns/Campaign.js";
import User from "../../models/user/User.js";
import { deleteFromCloudinary } from "../../services/cloudinary.service.js";
import {
  NotFoundError,
  ForbiddenError,
  DatabaseError,
} from "../../utils/errors.js";

export const deleteCampaignUsecase = async ({ userId, campaignId }) => {
  // Check user
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User");
  }

  if (user.role !== "NGO_ADMIN") {
    throw new ForbiddenError("Only NGO Admin can delete campaigns");
  }

  // Find campaign
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    throw new NotFoundError("Campaign");
  }

  // Ownership check
  if (campaign.createdBy.toString() !== userId.toString()) {
    throw new ForbiddenError("You are not allowed to delete this campaign");
  }

  try {
    // Delete cover image from Cloudinary
    if (campaign.coverImage?.public_id) {
      await deleteFromCloudinary(campaign.coverImage.public_id);
    }

    // Delete campaign from database
    await campaign.deleteOne();

    return true;

  } catch (error) {
    throw new DatabaseError("Failed to delete campaign");
  }
};