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
  const response = await axiosInstance.get("/campaigns/get-my-campaigns");
  return response.data;
};