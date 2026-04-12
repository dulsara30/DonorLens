import { Router } from "express";
import { FetchAllRegisterRequestController } from "../../controllers/admin/FetchAllRegisterRequestController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";
import ApproveNgoRequestController from "../../controllers/admin/ApproveNgoRequestController.js";
import PasswordSetupEmailSendController from "../../controllers/admin/PasswordSetupEmailSendController.js";
import RejectNgoRequestController from "../../controllers/admin/RejectNgoRequestController.js";
import DeleteNgoRegistrationRequestController from "../../controllers/admin/DeleteNgoRegistrationRequestController.js";
import ResubmissionRequiredController from "../../controllers/admin/ResubmissionRequiredController.js";
import DeactivateNgoRequestController from "../../controllers/admin/DeactivateNgoRequestController.js";
import FetchAllUsersController from "../../controllers/admin/FetchAllUsersController.js";
import GetUserByIdController from "../../controllers/admin/GetUserByIdController.js";

const adminRoutes = Router();

adminRoutes.get(
  "/fetch-all-register-requests",
  authenticateToken,
  authorizeRoles("ADMIN"),
  FetchAllRegisterRequestController,
);

adminRoutes.put(
  "/ngo-request/:ngoId/approve",
  authenticateToken,
  authorizeRoles("ADMIN"),
  ApproveNgoRequestController,
);

adminRoutes.put(
  "/ngo-request/:ngoId/reject",
  authenticateToken,
  authorizeRoles("ADMIN"),
  RejectNgoRequestController,
);

adminRoutes.put(
  "/ngo-request/:ngoId/deactivate",
  authenticateToken,
  authorizeRoles("ADMIN"),
  DeactivateNgoRequestController,
);

adminRoutes.put(
  "/ngo-request/:ngoId/resubmission-required",
  authenticateToken,
  authorizeRoles("ADMIN"),
  ResubmissionRequiredController,
);

adminRoutes.put(
  "/pw-Request/:ngoId",
  authenticateToken,
  authorizeRoles("ADMIN"),
  PasswordSetupEmailSendController,
);

adminRoutes.delete(
  "/ngo-request/:ngoId/delete",
  authenticateToken,
  authorizeRoles("ADMIN"),
  DeleteNgoRegistrationRequestController,
);

adminRoutes.get(
  "/users",
  authenticateToken,
  authorizeRoles("ADMIN"),
  FetchAllUsersController,
);

adminRoutes.get(
  "/users/:userId",
  authenticateToken,
  authorizeRoles("ADMIN"),
  GetUserByIdController,
);

export default adminRoutes;
