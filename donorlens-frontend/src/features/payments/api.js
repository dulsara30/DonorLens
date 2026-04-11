import axiosInstance from "../../lib/axios";

export const createPaymentApi = async (payload) => {
  const response = await axiosInstance.post("/payment", payload);
  return response.data;
};

export const getMyPaymentsApi = async () => {
  const response = await axiosInstance.get("/payment/my");
  return response.data;
};

export const getAllPaymentsApi = async () => {
  const response = await axiosInstance.get("/payment");
  return response.data;
};

export const getPaymentLogsApi = async () => {
  const response = await axiosInstance.get("/payment/logs");
  return response.data;
};