import Campaign from "../../models/campaigns/Campaign.js";
import User from "../../models/user/User.js";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../../utils/errors.js";

export const createCampaignUsecase = async ({
  userId,
  title,
  sdgGoalNumber,
  description,
  endDate,
  coverImage,
  financialBreakdown,
  location,
}) => {

  // Check user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User");
  }

  // Check role
  if (user.role !== "NGO_ADMIN") {
    throw new ForbiddenError("Only NGO Admin can create campaigns");
  }

  // Validate end date
  if (new Date(endDate) <= new Date()) {
    throw new ValidationError("End date must be in the future");
  }

  // Create campaign
  const campaign = new Campaign({
    createdBy: userId,
    title,
    sdgGoalNumber,
    description,
    endDate,
    coverImage,
    financialBreakdown,
    location,
  });

  await campaign.save();

  return campaign;
};