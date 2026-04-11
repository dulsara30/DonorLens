import Campaign from "../../models/campaigns/Campaign.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";

export const getPublicSingleCampaignUsecase = async ({ campaignId }) => {
  const campaign = await Campaign.findById(campaignId).populate({
    path: "createdBy",
    select: "ngoDetails.ngoName",
  });

  if (!campaign) {
    throw new NotFoundError("Campaign");
  }

  if (!["ONGOING", "COMPLETED"].includes(campaign.status)) {
    throw new ValidationError("This campaign is not publicly accessible");
  }

  return campaign;
};