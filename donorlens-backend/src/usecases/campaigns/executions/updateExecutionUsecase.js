import ExecutionUpdate from "../../../models/campaigns/executions/executions.js";
import Campaign from "../../../models/campaigns/Campaign.js";
import { recalculateCampaignProgress } from "../../../services/executions.service.js";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
  BadRequestError,
} from "../../../utils/errors.js";
import {
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
} from "../../../services/cloudinary.service.js";
import mongoose from "mongoose";

/**
 * Update Execution Update Usecase
 * Updates an execution update with partial data and optional new files
 * Can add new files, but doesn't remove existing ones unless explicitly done
 *
 * @param {Object} updateData - Update parameters
 * @param {string} updateData.userId - The authenticated user ID
 * @param {string} updateData.campaignId - The campaign ID
 * @param {string} updateData.executionId - The execution update ID
 * @param {string} updateData.title - Updated title (optional)
 * @param {Date} updateData.date - Updated date (optional)
 * @param {string} updateData.description - Updated description (optional)
 * @param {number} updateData.fundsUsed - Updated funds used (optional)
 * @param {Object} updateData.executionFile - New files to add (optional)
 * @returns {Object} - Updated execution and campaign data
 */
export const updateExecutionUsecase = async (updateData) => {
  try {
    const {
      userId,
      campaignId,
      executionId,
      title,
      date,
      description,
      fundsUsed,
      executionFile,
    } = updateData;

    // Validate ID formats
    if (!mongoose.Types.ObjectId.isValid(executionId)) {
      throw new ValidationError("Invalid execution ID format");
    }

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new ValidationError("Invalid campaign ID format");
    }

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }

    // Check if user is the campaign creator (authorization)
    if (campaign.createdBy.toString() !== userId) {
      throw new ForbiddenError(
        "Only the campaign creator can update execution updates",
      );
    }

    // Fetch the execution update
    const execution = await ExecutionUpdate.findById(executionId);

    if (!execution) {
      throw new NotFoundError("Execution update not found");
    }

    // Verify that the execution belongs to the specified campaign
    if (execution.campaignId.toString() !== campaignId) {
      throw new ValidationError(
        "Execution update does not belong to the specified campaign",
      );
    }

    // Validate fundsUsed if provided
    if (fundsUsed !== undefined && fundsUsed < 0) {
      throw new ValidationError("Funds used cannot be negative");
    }

    // Build update object with only provided fields
    const updates = {};

    if (title !== undefined) {
      if (!title.trim()) {
        throw new BadRequestError("Title cannot be empty");
      }
      updates.title = title.trim();
    }

    if (date !== undefined) {
      updates.date = date;
    }

    if (description !== undefined) {
      if (!description.trim()) {
        throw new BadRequestError("Description cannot be empty");
      }
      updates.description = description.trim();
    }

    if (fundsUsed !== undefined) {
      updates.fundsUsed = fundsUsed;
    }

    // Handle new file uploads
    if (executionFile) {
      // Upload new evidence photos if provided
      if (executionFile.evidencePhotos && executionFile.evidencePhotos.length > 0) {
        const newEvidencePhotos = await uploadMultipleToCloudinary(
          executionFile.evidencePhotos,
          "donorlens/execution-updates/photos",
        );

        const formattedNewPhotos = newEvidencePhotos.map((photo) => ({
          public_id: photo.publicId,
          secure_url: photo.url,
        }));

        // Add new photos to existing ones
        updates.evidencePhotos = [
          ...execution.evidencePhotos,
          ...formattedNewPhotos,
        ];

        console.log(
          `Added ${newEvidencePhotos.length} new evidence photos`,
        );
      }

      // Upload new receipts if provided
      if (executionFile.receipts && executionFile.receipts.length > 0) {
        const newReceipts = await uploadMultipleToCloudinary(
          executionFile.receipts,
          "donorlens/execution-updates/receipts",
        );

        const formattedNewReceipts = newReceipts.map((receipt, index) => ({
          public_id: receipt.publicId,
          secure_url: receipt.url,
          fileName:
            executionFile.receipts[index]?.originalname || "receipt",
        }));

        // Add new receipts to existing ones
        updates.receipts = [...execution.receipts, ...formattedNewReceipts];

        console.log(`Added ${newReceipts.length} new receipts`);
      }
    }

    // Check if there are any updates to apply
    if (Object.keys(updates).length === 0) {
      throw new BadRequestError("No valid fields provided for update");
    }

    // Update the execution
    const updatedExecution = await ExecutionUpdate.findByIdAndUpdate(
      executionId,
      { $set: updates },
      { new: true, runValidators: true },
    );

    console.log(`Execution update updated: ${executionId}`);

    // Recalculate campaign progress if fundsUsed was changed
    let updatedCampaign = campaign;
    if (fundsUsed !== undefined) {
      updatedCampaign = await recalculateCampaignProgress(campaignId);
      console.log(
        `Campaign progress recalculated. New totalUsedAmount: ${updatedCampaign.totalUsedAmount}, progressPercentage: ${updatedCampaign.progressPercentage}%`,
      );
    }

    return {
      executionUpdate: updatedExecution,
      campaign: {
        id: updatedCampaign._id,
        title: updatedCampaign.title,
        totalPlannedCost: updatedCampaign.totalPlannedCost,
        raisedAmount: updatedCampaign.raisedAmount,
        totalUsedAmount: updatedCampaign.totalUsedAmount,
        progressPercentage: updatedCampaign.progressPercentage,
        status: updatedCampaign.status,
      },
    };
  } catch (error) {
    console.error("Error in updateExecutionUsecase:", error);
    throw error;
  }
};
