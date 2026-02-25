import Campaign from "../../models/campaigns/Campaign.js";
import User from "../../models/user/User.js";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../../utils/errors.js";

import emailService from "../../services/email.service.js";


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
    totalUsedAmount: 0,
    progressPercentage: 0,
  });

  await campaign.save();

  // Send campaign creation confirmation email (non-blocking)
  try {
    await emailService.sendCampaignCreated({
      adminEmail: user.email,
      adminName: user.fullName,
      campaignTitle: campaign.title,
      campaignId: campaign._id.toString(),
    });
    console.log(" Campaign creation email sent to:", user.email);
  } catch (emailError) {
    // Log error but don't fail campaign creation
    console.error(
      "Failed to send campaign creation email:",
      emailError.message,
    );
  }

  return campaign;
};
