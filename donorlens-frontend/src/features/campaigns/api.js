import axiosInstance from "../../lib/axios";

export const createCampaignApi = async (formData) => {
  const response = await axiosInstance.post("/ngo/campaigns/add-campaign", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMyCampaignsApi = async () => {
  const response = await axiosInstance.get("/ngo/campaigns/get-my-campaigns");
  return response.data;
};

export const deleteCampaignApi = async (campaignId) => {
  const response = await axiosInstance.delete(
    `/ngo/campaigns/delete-campaign/${campaignId}`
  );
  return response.data;
};

export const getSingleCampaignApi = async (campaignId) => {
  const response = await axiosInstance.get(
    `/ngo/campaigns/get-my-campaign/${campaignId}`
  );
  return response.data;
};

export const updateCampaignApi = async (campaignId, payload) => {
  const response = await axiosInstance.put(
    `/ngo/campaigns/update-campaign/${campaignId}`,
    payload
  );
  return response.data;
};