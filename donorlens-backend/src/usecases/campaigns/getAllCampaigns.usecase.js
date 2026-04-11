import Campaign from "../../models/campaigns/Campaign.js";

export const getAllCampaignsUsecase = async ({ status, limit }) => {
  const query = {
    status: { $in: ["ONGOING", "COMPLETED"] },
  };

  if (status) {
    query.status = status;
  }

  let campaignQuery = Campaign.find(query).sort({ createdAt: -1 });

  if (limit) {
    campaignQuery = campaignQuery.limit(Number(limit));
  }

  const campaigns = await campaignQuery;
  return campaigns;
};