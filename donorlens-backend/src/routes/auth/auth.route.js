// src/routes/auth/auth.route.js
// Authentication routes

import { Router } from "express";
import { loginController } from "../../controllers/auth/LoginController.js";
import { registerUserController } from "../../controllers/auth/RegisterUserController.js";
import { registerNgoController } from "../../controllers/auth/RegisterNgoController.js";
import { refreshTokenController } from "../../controllers/auth/RefreshTokenController.js";
import { getCurrentUserController } from "../../controllers/auth/GetCurrentUserController.js";
import { logoutController } from "../../controllers/auth/LogoutController.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const authRouter = Router();

// ========== PUBLIC ROUTES (No Authentication Required) ==========

/**
 * POST /api/auth/register/user
 * Normal user (donor) registration endpoint
 * 
 * Request body:
 * {
 *   "fullName": "John Doe",
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": {
 *     "user": { id, fullName, email, role: "USER", createdAt }
 *   }
 * }
 */
authRouter.post("/register/user", registerUserController);

/**
 * POST /api/auth/register/ngo
 * NGO admin registration endpoint
 * 
 * Request body:
 * {
 *   "fullName": "Jane Smith",
 *   "email": "jane@ngo.org",
 *   "password": "password123",
 *   "ngoName": "Green Earth Foundation",
 *   "registrationNumber": "NGO12345",
 *   "contactNumber": "+1234567890",
 *   "website": "https://greenearth.org",
 *   "address": "123 Main St, City, Country"
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "NGO admin registered successfully",
 *   "data": {
 *     "user": { id, fullName, email, role: "NGO_ADMIN", ngoDetails, createdAt }
 *   }
 * }
 */
authRouter.post("/register/ngo", registerNgoController);

/**
 * POST /api/auth/login
 * Login endpoint - authenticates user and returns JWT tokens
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "userPassword123"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "accessToken": "jwt_access_token",
 *     "user": { id, fullName, email, role }
 *   }
 * }
 * 
 * Also sets HttpOnly cookie with refresh token
 */
authRouter.post("/login", loginController);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token from HttpOnly cookie
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Access token refreshed successfully",
 *   "data": {
 *     "accessToken": "new_jwt_access_token"
 *   }
 * }
 */
authRouter.post("/refresh", refreshTokenController);

/**
 * POST /api/auth/logout
 * Logout endpoint - clears refresh token cookie
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Logged out successfully"
 * }
 */
authRouter.post("/logout", logoutController);

// ========== PROTECTED ROUTES (Authentication Required) ==========

/**
 * GET /api/auth/me
 * Get current authenticated user information
 * Requires valid access token in Authorization header
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": { id, fullName, email, role, createdAt, ... }
 *   }
 * }
 */
authRouter.get("/me", authenticateToken, getCurrentUserController);

export default authRouter;