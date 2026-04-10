import axiosInstance from "../../lib/axios";

export const getExecutions = (campaignId) =>
  axiosInstance.get(`/campaign-executions/${campaignId}/executions`);

export const createExecution = (campaignId, data) =>
  axiosInstance.post(`/campaign-executions/${campaignId}/executions`, data);

export const deleteExecution = (campaignId, executionId) =>
  axiosInstance.delete(
    `/campaign-executions/${campaignId}/executions/${executionId}`,
  );
