// API calls related to the user profile
import api from "../../lib/axios";

export const getUserDonations = async () => {
  const response = await api.get("/payment/my");
  return response.data;
};