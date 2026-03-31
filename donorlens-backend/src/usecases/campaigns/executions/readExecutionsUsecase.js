import ExecutionUpdate from "../../../models/campaigns/executions/executions.js";
import Campaign from "../../../models/campaigns/Campaign.js";
import { NotFoundError, ValidationError } from "../../../utils/errors.js";
import mongoose from "mongoose";

export const getAllExecutionsUsecase = async (campaignId) => {
  try {
    // Validate campaignId format
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new ValidationError("Invalid campaign ID format");
    }

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId).select(
      "title totalPlannedCost raisedAmount totalUsedAmount progressPercentage status createdBy",
    );

    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }

    // Fetch all execution updates for this campaign
    const executions = await ExecutionUpdate.find({ campaignId })
      .sort({ date: -1 }) 
      .lean(); 

    // Calculate summary statistics
    const summary = {
      totalExecutions: executions.length,
      totalFundsUsed: executions.reduce((sum, exec) => sum + exec.fundsUsed, 0),
      totalEvidencePhotos: executions.reduce(
        (sum, exec) => sum + exec.evidencePhotos.length,
        0,
      ),
      totalReceipts: executions.reduce(
        (sum, exec) => sum + exec.receipts.length,
        0,
      ),
    };

    return {
      campaign: {
        id: campaign._id,
        title: campaign.title,
        totalPlannedCost: campaign.totalPlannedCost,
        raisedAmount: campaign.raisedAmount,
        totalUsedAmount: campaign.totalUsedAmount,
        progressPercentage: campaign.progressPercentage,
        status: campaign.status,
      },
      summary,
      executions,
    };
  } catch (error) {
    console.error("Error in getAllExecutionsUsecase:", error);
    throw error;
  }
};

export const getExecutionByIdUsecase = async (executionId, campaignId) => {
  try {
    // Validate IDs format
    if (!mongoose.Types.ObjectId.isValid(executionId)) {
      throw new ValidationError("Invalid execution ID format");
    }

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new ValidationError("Invalid campaign ID format");
    }

    // Fetch the execution update
    const execution = await ExecutionUpdate.findById(executionId).lean();

    if (!execution) {
      throw new NotFoundError("Execution update not found");
    }

    // Verify that the execution belongs to the specified campaign
    if (execution.campaignId.toString() !== campaignId) {
      throw new ValidationError(
        "Execution update does not belong to the specified campaign",
      );
    }

    // Fetch campaign details
    const campaign = await Campaign.findById(campaignId)
      .select("title createdBy")
      .populate("createdBy", "fullName email ngoDetails.ngoName");

    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }

    return {
      execution,
      campaign: {
        id: campaign._id,
        title: campaign.title,
        createdBy: campaign.createdBy,
      },
    };
  } catch (error) {
    console.error("Error in getExecutionByIdUsecase:", error);
    throw error;
  }
};
