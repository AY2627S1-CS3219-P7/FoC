// AI Assistance Disclosure:
// Tool: Gemini, date: 2026-10-03
// Scope: Added POST /me/change-password route for authenticated password modification.
// Author review: Verified route order and authentication middleware protection.

import { Router } from "express";

import { authenticate } from "../../../common/middleware/authenticate.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/me", authenticate, userController.getCurrentUserProfile);
router.patch("/me", authenticate, userController.updateCurrentUserProfile);
router.post("/me/change-password", authenticate, userController.changePassword);
router.post("/batch", authenticate, userController.getUsersBatch);
router.get("/:userId", authenticate, userController.getUserById);

export default router;
