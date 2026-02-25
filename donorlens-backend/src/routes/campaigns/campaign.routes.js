import express from "express";

import {  createCampaign } from "../../controllers/campaigns/createCampaign.controller.js";
import { getMyCampaignsController } from "../../controllers/campaigns/getMyCampaigns.controller.js";
import { getSingleCampaignController } from "../../controllers/campaigns/getSingleCampaign.controller.js";
import { updateCampaignController } from "../../controllers/campaigns/updateCampaign.controller.js";
import { deleteCampaignController } from "../../controllers/campaigns/deleteCampaign.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/add-campaign",
  authenticateToken,
  upload.single("coverImage"),
  createCampaign,
);


router.get(
  "/get-my-campaigns", 
  authenticateToken, 
  getMyCampaignsController
);

router.get(
  "/get-my-campaign/:campaignId", 
  authenticateToken, 
  getSingleCampaignController
);

router.put(
  "/update-campaign/:campaignId", 
  authenticateToken, 
  updateCampaignController
);

router.delete(
  "/delete-campaign/:campaignId",
  authenticateToken,
  deleteCampaignController
);

export default router;

