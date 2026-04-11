import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosInstance from "@/lib/axios";
import * as campaignApi from "@/features/campaigns/api.js";

vi.mock("@/lib/axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  },
}));

describe("Campaign API helper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call createCampaignApi with multipart form data", async () => {
    const formData = new FormData();
    formData.append("title", "Test Campaign");

    axiosInstance.post.mockResolvedValue({ data: { success: true, data: { title: "Test Campaign" } } });

    const result = await campaignApi.createCampaignApi(formData);

    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/ngo/campaigns/add-campaign",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    expect(result).toEqual({ success: true, data: { title: "Test Campaign" } });
  });

  it("should call getMyCampaignsApi and return data", async () => {
    axiosInstance.get.mockResolvedValue({ data: { success: true, data: [] } });

    const result = await campaignApi.getMyCampaignsApi();

    expect(axiosInstance.get).toHaveBeenCalledWith("/ngo/campaigns/get-my-campaigns");
    expect(result).toEqual({ success: true, data: [] });
  });

  it("should call deleteCampaignApi with campaign id", async () => {
    const campaignId = "abc123";
    axiosInstance.delete.mockResolvedValue({ data: { success: true, message: "Deleted" } });

    const result = await campaignApi.deleteCampaignApi(campaignId);

    expect(axiosInstance.delete).toHaveBeenCalledWith(`/ngo/campaigns/delete-campaign/${campaignId}`);
    expect(result).toEqual({ success: true, message: "Deleted" });
  });

  it("should call updateCampaignApi with campaign id and payload", async () => {
    const campaignId = "abc123";
    const payload = { title: "Updated" };
    axiosInstance.put.mockResolvedValue({ data: { success: true, data: payload } });

    const result = await campaignApi.updateCampaignApi(campaignId, payload);

    expect(axiosInstance.put).toHaveBeenCalledWith(`/ngo/campaigns/update-campaign/${campaignId}`, payload);
    expect(result).toEqual({ success: true, data: payload });
  });

  it("should call getPublicCampaignsApi with params object", async () => {
    const params = { status: "ONGOING", limit: 5 };
    axiosInstance.get.mockResolvedValue({ data: { success: true, data: [] } });

    const result = await campaignApi.getPublicCampaignsApi(params);

    expect(axiosInstance.get).toHaveBeenCalledWith("/ngo/campaigns/get-all-campaigns", { params });
    expect(result).toEqual({ success: true, data: [] });
  });
});
