import { createExecutions } from "../../../usecases/campaigns/executions/createExecutionsUsecase.js";
import {
  getAllExecutionsUsecase,
  getExecutionByIdUsecase,
} from "../../../usecases/campaigns/executions/readExecutionsUsecase.js";
import { updateExecutionUsecase } from "../../../usecases/campaigns/executions/updateExecutionUsecase.js";
import { deleteExecutionUsecase } from "../../../usecases/campaigns/executions/deleteExecutionUsecase.js";
import { ApiResponse, sendCreated } from "../../../utils/apiResponse.js";
import { NotFoundError } from "../../../utils/errors.js";

/**
 * Create Execution Update Controller
 * Handles file uploads and creates execution update
 */
export const createExecutionUpdate = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // const userId = "698e1f3cb308e018d5d2186f";

    if (!userId) {
      throw new NotFoundError("User not found. Authentication required.");
    }

    const { campaignId } = req.params; // Get from URL params

    const { title, date, description, fundsUsed } = req.body;

    const executionFile = req.files; // Get files from multer

    // Validate files are uploaded
    if (!executionFile || !executionFile.evidencePhotos) {
      throw new NotFoundError("Evidence photos are required.");
    }

    const execution = {
      userId,
      campaignId,
      title,
      date,
      description,
      fundsUsed: Number(fundsUsed),
      executionFile,
    };

    // Create execution update
    const result = await createExecutions({ execution });

    // return sendCreated(res, result, "Execution update created successfully");
    return ApiResponse.created(
      res,
      result,
      "Execution update created successfully",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Execution Updates for a Campaign Controller
 * Returns all execution updates for a specific campaign
 */
export const getAllExecutionsByCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const executions = await getAllExecutionsUsecase(campaignId);

    return ApiResponse.success(res, {
      message: "Execution updates retrieved successfully",
      data: executions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Execution Update by ID Controller
 * Returns a single execution update with full details
 */
export const getExecutionById = async (req, res, next) => {
  try {
    const { campaignId, executionId } = req.params;

    const execution = await getExecutionByIdUsecase(executionId, campaignId);

    return ApiResponse.success(res, {
      message: "Execution update retrieved successfully",
      data: execution,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Execution Update Controller
 * Handles partial updates to execution updates with optional file uploads
 */
export const updateExecutionUpdate = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // const userId = "698e1f3cb308e018d5d2186f";

    if (!userId) {
      throw new NotFoundError("User not found. Authentication required.");
    }

    const { campaignId, executionId } = req.params;
    const { title, date, description, fundsUsed } = req.body;

    const executionFile = req.files; // Optional files for update

    const updateData = {
      userId,
      campaignId,
      executionId,
      title,
      date,
      description,
      fundsUsed: fundsUsed ? Number(fundsUsed) : undefined,
      executionFile,
    };

    const result = await updateExecutionUsecase(updateData);

    return ApiResponse.success(res, {
      message: "Execution update updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Execution Update Controller
 * Deletes an execution update and recalculates campaign progress
 */
export const deleteExecutionUpdate = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // const userId = "698e1f3cb308e018d5d2186f";


    if (!userId) {
      throw new NotFoundError("User not found. Authentication required.");
    }

    const { campaignId, executionId } = req.params;

    const result = await deleteExecutionUsecase({
      userId,
      campaignId,
      executionId,
    });

    return ApiResponse.success(res, {
      message: "Execution update deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
