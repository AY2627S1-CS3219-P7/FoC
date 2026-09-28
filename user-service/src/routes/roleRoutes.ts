import { Router } from "express";
import * as roleController from "../controllers/roleController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/users/:id/roles", authMiddleware, roleController.getUserRoles);

export default router;