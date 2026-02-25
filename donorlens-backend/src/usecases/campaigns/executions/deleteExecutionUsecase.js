import ExecutionUpdate from "../../../models/campaigns/executions/executions.js";
import Campaign from "../../../models/campaigns/Campaign.js";
import { recalculateCampaignProgress } from "../../../services/executions.service.js";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "../../../utils/errors.js";
import { deleteFromCloudinary } from "../../../services/cloudinary.service.js";
import mongoose from "mongoose";

/**
 * Delete Execution Update Usecase
 * Deletes an execution update, removes files from Cloudinary,
 * and recalculates campaign progress
 *
 * @param {Object} params - Delete parameters
 * @param {string} params.userId - The authenticated user ID
 * @param {string} params.campaignId - The campaign ID
 * @param {string} params.executionId - The execution update ID to delete
 * @returns {Object} - Deleted execution info and updated campaign
 */
export const deleteExecutionUsecase = async ({
  userId,
  campaignId,
  executionId,
}) => {
  try {
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
        "Only the campaign creator can delete execution updates",
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

    // Store execution data before deletion for response
    const deletedExecutionData = {
      id: execution._id,
      title: execution.title,
      fundsUsed: execution.fundsUsed,
      date: execution.date,
    };

    // Delete files from Cloudinary
    try {
      // Delete evidence photos
      if (execution.evidencePhotos && execution.evidencePhotos.length > 0) {
        const photoDeletePromises = execution.evidencePhotos.map((photo) =>
          deleteFromCloudinary(photo.public_id),
        );
        await Promise.all(photoDeletePromises);
        console.log(
          `Deleted ${execution.evidencePhotos.length} evidence photos from Cloudinary`,
        );
      }

      // Delete receipts
      if (execution.receipts && execution.receipts.length > 0) {
        const receiptDeletePromises = execution.receipts.map((receipt) =>
          deleteFromCloudinary(receipt.public_id),
        );
        await Promise.all(receiptDeletePromises);
        console.log(
          `Deleted ${execution.receipts.length} receipts from Cloudinary`,
        );
      }
    } catch (cloudinaryError) {
      // Log error but don't fail the deletion
      console.error(
        "Failed to delete some files from Cloudinary:",
        cloudinaryError.message,
      );
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete the execution update from database
    await ExecutionUpdate.findByIdAndDelete(executionId);

    console.log(`Execution update deleted from database: ${executionId}`);

    // Recalculate campaign progress after deletion
    const updatedCampaign = await recalculateCampaignProgress(campaignId);

    console.log(
      `Campaign progress recalculated after deletion. New totalUsedAmount: ${updatedCampaign.totalUsedAmount}, progressPercentage: ${updatedCampaign.progressPercentage}%`,
    );

    return {
      deletedExecution: deletedExecutionData,
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
    console.error("Error in deleteExecutionUsecase:", error);
    throw error;
  }
};
