import Campaign from "../../models/campaigns/Campaign.js";
import User from "../../models/user/User.js";
import { NotFoundError, ForbiddenError } from "../../utils/errors.js";

export const getMyCampaignsUsecase = async ({ userId }) => {
  // Check user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User");
  }

  // Check role
  if (user.role !== "NGO_ADMIN") {
    throw new ForbiddenError("Only NGO Admin can view their campaigns");
  }

  // Fetch campaigns created by this user
  const campaigns = await Campaign.find({
    createdBy: userId,
    status: { $ne: "CANCELLED" },
  }).sort({ createdAt: -1 });

  return campaigns;
};
