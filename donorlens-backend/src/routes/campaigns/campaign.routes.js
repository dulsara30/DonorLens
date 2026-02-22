import express from "express";
import {  createCampaign } from "../../controllers/campaigns/campaign.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  upload.single("coverImage"),
  createCampaign
);

export default router;