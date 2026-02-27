import { Router } from "express";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from "../../controllers/campaigns/campaignComment.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/comments/:campaignId", authenticateToken, getComments);

router.post("/comment/:campaignId", authenticateToken, addComment);

router.put("/comment/:commentId", authenticateToken, updateComment);

router.delete("/comment/:commentId", authenticateToken, deleteComment);

export default router;
