import { Router } from "express";
import { FetchAllRegisterRequestController } from "../../controllers/admin/FetchAllRegisterRequestController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";

const adminRoutes = Router();

adminRoutes.get(
  "/fetch-all-register-requests",
  authenticateToken,
  authorizeRoles(["ADMIN"]),
  FetchAllRegisterRequestController,
);

export default adminRoutes;
