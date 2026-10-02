import { Router } from "express";

import { authenticate } from "../../../common/index.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/me", authenticate, userController.getCurrentUserProfile);
router.patch("/me", authenticate, userController.updateCurrentUserProfile);

export default router;