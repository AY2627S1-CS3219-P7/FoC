import { Router } from "express";
import * as userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, userController.getCurrentUserProfile);
router.patch("/me", authMiddleware, userController.updateCurrentUserProfile);

export default router;