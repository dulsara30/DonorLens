import { Router } from "express";
import {
  deleteTestUserByEmail,
  deleteAllTestUsers,
} from "../../controllers/test/TestCleanupController.js";

const testRoutes = Router();

/**
 * ⚠️ DEVELOPMENT/TESTING ONLY ROUTES
 * These routes should be disabled in production!
 */

// Delete a single test user by email
testRoutes.delete("/cleanup/user/:email", deleteTestUserByEmail);

// Delete all test users
testRoutes.delete("/cleanup/all", deleteAllTestUsers);

export default testRoutes;
