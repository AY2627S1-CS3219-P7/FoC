import { Router } from "express";

import { authenticate } from "../../../common/middleware/authenticate.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/me", authenticate, userController.getCurrentUserProfile);
router.patch("/me", authenticate, userController.updateCurrentUserProfile);
router.get("/:userId", authenticate, userController.getUserById);

export default router;
