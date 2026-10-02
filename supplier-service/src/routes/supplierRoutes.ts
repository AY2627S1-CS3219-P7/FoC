/**
 * AI Assistance Disclosure
 * Tool: GitHub Copilot (GPT-6 Luna)
 * Scope: Require authentication and allow all defined roles on each supplier API route.
 * Author review: Reviewed and manually edited to allow the correct roles for each route
 */

import express from "express";

import { authenticate, requireRoles } from "@common/index.js";
import {
  addSupplier,
  deactivateSupplier,
  getAllSuppliers,
  getSupplierById,
  searchSuppliers,
  updateSupplier,
} from "../controllers/supplierController.ts";

const router = express.Router();
const requireAnyRole = requireRoles("ADMIN", "REQUESTER", "COURIER");
const requireAdminRole = requireRoles("ADMIN");

// GET api/suppliers/
router.get("/", authenticate, requireAnyRole, getAllSuppliers);

// GET api/suppliers/search
router.get("/search", authenticate, requireAnyRole, searchSuppliers);

// GET api/suppliers/:id
router.get("/:id", authenticate, requireAnyRole, getSupplierById);

// POST api/suppliers
router.post("/", authenticate, requireAdminRole, addSupplier);

// PATCH api/suppliers/deactivate/:id
router.patch("/deactivate/:id", authenticate, requireAdminRole, deactivateSupplier);

// PATCH api/suppliers/:id
router.patch("/:id", authenticate, requireAdminRole, updateSupplier);

export default router;