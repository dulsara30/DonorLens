import { describe, it, expect } from "vitest";
import {
  validateBasicInfo,
  validateFinancialBreakdown,
  validateMedia,
} from "@/features/campaigns/validation.js";

describe("Campaign validation utilities", () => {
  it("should return validation errors when required basic info fields are missing", () => {
    const errors = validateBasicInfo({
      title: "",
      sdgGoalNumber: "",
      description: "",
      endDate: "",
      location: { locationName: "" },
    });

    expect(errors.title).toBe("Title is required");
    expect(errors.sdgGoalNumber).toBe("SDG Goal is required");
    expect(errors.description).toBe("Description is required");
    expect(errors.endDate).toBe("End date is required");
    expect(errors.location).toBe("Location is required");
  });

  it("should return an error when end date is not in the future", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const errors = validateBasicInfo({
      title: "Campaign Title",
      sdgGoalNumber: 5,
      description: "Valid description",
      endDate: yesterday,
      location: { locationName: "Colombo" },
    });

    expect(errors.endDate).toBe("End date must be in the future");
  });

  it("should allow valid basic info without errors", () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const errors = validateBasicInfo({
      title: "Campaign Title",
      sdgGoalNumber: 1,
      description: "Valid campaign description",
      endDate: tomorrow,
      location: { locationName: "Kandy" },
    });

    expect(errors).toEqual({});
  });

  it("should require a cover image for media validation", () => {
    const errors = validateMedia({
      coverImage: null,
    });

    expect(errors.coverImage).toBe("Cover image is required");
  });

  it("should validate financial breakdown item fields and cost values", () => {
    const errors = validateFinancialBreakdown({
      financialBreakdown: [
        { itemName: "", cost: "", description: "" },
        { itemName: "Transport", cost: -50, description: "Valid" },
        { itemName: "Marketing", cost: 100, description: "a".repeat(501) },
      ],
    });

    expect(errors.itemErrors[0].itemName).toBe("Item name is required");
    expect(errors.itemErrors[0].cost).toBe("Valid cost is required");
    expect(errors.itemErrors[1].cost).toBe("Valid cost is required");
    expect(errors.itemErrors[2].description).toBe("Description max length is 500");
  });

  it("should allow a valid financial breakdown item", () => {
    const errors = validateFinancialBreakdown({
      financialBreakdown: [
        { itemName: "Food", cost: 100, description: "Meal support" },
      ],
    });

    expect(errors.itemErrors[0]).toEqual({});
  });
});
