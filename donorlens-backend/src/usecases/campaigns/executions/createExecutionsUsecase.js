import ExecutionUpdate from "../../../models/campaigns/executions/executions.js";
import Campaign from "../../../models/campaigns/Campaign.js";
import { recalculateCampaignProgress } from "../../../services/executions.service.js";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
  BadRequestError,
} from "../../../utils/errors.js";
import { uploadMultipleToCloudinary } from "../../../services/cloudinary.service.js";

export const createExecutions = async ({ execution }) => {
  
  const {
    userId,
    campaignId,
    title,
    date,
    description,
    fundsUsed,
    executionFile,
  } = execution;

  //validate required fields
  if (!campaignId || !title || !description || fundsUsed === undefined) {
    throw new BadRequestError(
      "Campaign ID, title, description and funds used are required.",
    );
  }

  if (fundsUsed < 0) {
    throw new ValidationError("Funds used can not be negative.");
  }

  // Validate that the date is not in the future
  if (date) {
    const executionDate = new Date(date);
    const currentDate = new Date();
    
    // Set time to start of day for comparison
    executionDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    if (executionDate > currentDate) {
      throw new ValidationError("Execution date cannot be a future date.");
    }
  }

  //check if campaign exists
  const campaign = await Campaign.findById(campaignId);

  if (!campaign) {
    throw new NotFoundError("Campaign not found.");
  }

  //check if user is the campaign creator (NGO_ADMIN who created it)
  if (campaign.createdBy.toString() !== userId) {
    throw new ForbiddenError(
      "Only the campaign creator can add execution updates.",
    );
  }

  // Upload evidence photos to Cloudinary
  const evidencePhotos = await uploadMultipleToCloudinary(
    executionFile.evidencePhotos,
    "donorlens/execution-updates/photos",
  );

  // Upload receipts if provided (optional)
  let receipts = [];
  if (executionFile.receipts && executionFile.receipts.length > 0) {
    receipts = await uploadMultipleToCloudinary(
      executionFile.receipts,
      "donorlens/execution-updates/receipts",
    );
  }

  // Format evidence photos for database
  const formattedEvidencePhotos = evidencePhotos.map((photo) => ({
    public_id: photo.publicId,
    secure_url: photo.url,
  }));

  // Format receipts for database
  const formattedReceipts = receipts.map((receipt, index) => ({
    public_id: receipt.publicId,
    secure_url: receipt.url,
    fileName: executionFile.receipts[index]?.originalname || "receipt",
  }));

  //validate evidencePhotos array
  if (!evidencePhotos || evidencePhotos.length === 0) {
    throw new ValidationError("At least one evidence photo is required.");
  }

  //create execution update
  const executionUpdate = new ExecutionUpdate({
    campaignId,
    title,
    date: date || new Date(),
    description,
    fundsUsed,
    evidencePhotos: formattedEvidencePhotos,
    receipts: formattedReceipts,
  });

  await executionUpdate.save({ wtimeout: 5000 });

  //recalculate campaign progress
  const updatedCampaign = await recalculateCampaignProgress(campaignId);

  return {
    executionUpdate,
    campaign: updatedCampaign,
  };
};
