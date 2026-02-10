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


authRouter.post("/register/user", registerUserController);


authRouter.post("/register/ngo", registerNgoController);


authRouter.post("/login", loginController);


authRouter.post("/refresh", refreshTokenController);


authRouter.post("/logout", logoutController);


authRouter.get("/me", authenticateToken, getCurrentUserController);

export default authRouter;