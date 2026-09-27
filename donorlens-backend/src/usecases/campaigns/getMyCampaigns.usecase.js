import Campaign from "../../models/campaigns/Campaign.js";
import User from "../../models/user/User.js";
import { NotFoundError, ForbiddenError } from "../../utils/errors.js";

export const getMyCampaignsUsecase = async ({ userId, status, limit }) => {
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
  const filter = {
    createdBy: userId,
  };

  if (status) {
    filter.status = status;
  } else {
    filter.status = { $ne: "CANCELLED" };
  }

  let query = Campaign.find(filter).sort({ createdAt: -1 });

  if (limit) {
    query = query.limit(limit);
  }

  const campaigns = await query;

  return campaigns;
};
