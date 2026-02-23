import express from "express";
import {
  createExecutionUpdate,
  getAllExecutionsByCampaign,
  getExecutionById,
  deleteExecutionUpdate,
} from "../../../controllers/campaigns/executions/executions.controller.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../../../middleware/auth.middleware.js";
import { uploadFields } from "../../../middleware/upload.middleware.js";
import { validateFiles } from "../../../middleware/fileValidation.middleware.js";
import { ALLOWED_FILE_TYPES } from "../../../utils/fileHelpers.js";

const router = express.Router();

// Create execution update
router.post(
  "/:campaignId/add-execution",
  authenticateToken,
  authorizeRoles("NGO_ADMIN"),
  uploadFields([
    { name: "evidencePhotos", maxCount: 5 },
    { name: "receipts", maxCount: 5 },
  ]),
  validateFiles({
    allowedTypes: ALLOWED_FILE_TYPES.all,
    minFiles: 1,
    maxFiles: 15,
  }),
  createExecutionUpdate,
);

// Get all execution updates for a specific campaign
router.get("/:campaignId", getAllExecutionsByCampaign);

// Get a single execution update by ID
router.get("/:campaignId/:executionId", getExecutionById);

// Delete an execution update
router.delete(
  "/:campaignId/:executionId",
  authenticateToken,
  authorizeRoles("NGO_ADMIN"),
  deleteExecutionUpdate,
);

export default router;
