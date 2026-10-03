import { Router } from "express";

import { authenticate } from "../../../common/middleware/authenticate.js";
import { requireRoles } from "../../../common/middleware/rbac.js";
import * as roleController from "../controllers/roleController.js";

const router = Router();

router.get("/users/:id/roles", authenticate, roleController.getUserRoles);
router.post("/users/:id/roles", authenticate, requireRoles("ADMIN"), roleController.addRole);
router.delete("/users/:id/roles/:role", authenticate, requireRoles("ADMIN"), roleController.removeRole);

export default router;
