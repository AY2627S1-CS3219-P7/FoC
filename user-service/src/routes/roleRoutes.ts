import { Router } from "express";

import { authenticate } from "../../../common/index.js";
import * as roleController from "../controllers/roleController.js";

const router = Router();

router.get("/users/:id/roles", authenticate, roleController.getUserRoles);

export default router;