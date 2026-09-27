import { getMyCampaignsUsecase } from "../../usecases/campaigns/getMyCampaigns.usecase.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { InvalidInputError } from "../../utils/errors.js";

const ALLOWED_STATUSES = ["ONGOING", "COMPLETED", "CANCELLED"];

export const getMyCampaignsController = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { status, limit } = req.query;

    let validatedStatus;
    if (status !== undefined) {
      if (typeof status !== "string" || !ALLOWED_STATUSES.includes(status)) {
        throw new InvalidInputError(
          "Invalid status query parameter. Must be one of: ONGOING, COMPLETED, CANCELLED as a single string.",
        );
      }
      validatedStatus = status;
    }

    let validatedLimit;
    if (limit !== undefined) {
      const numLimit = Number(limit);
      if (
        typeof limit === "object" ||
        Array.isArray(limit) ||
        !Number.isInteger(numLimit) ||
        numLimit < 1 ||
        numLimit > 100
      ) {
        throw new InvalidInputError(
          "Invalid limit query parameter. Must be an integer between 1 and 100.",
        );
      }
      validatedLimit = numLimit;
    }

    const campaigns = await getMyCampaignsUsecase({
      userId,
      status: validatedStatus,
      limit: validatedLimit,
    });

    return ApiResponse.success(res, {
      statusCode: 200,
      message: "My campaigns retrieved successfully",
      data: campaigns,
    });
  } catch (error) {
    next(error);
  }
};