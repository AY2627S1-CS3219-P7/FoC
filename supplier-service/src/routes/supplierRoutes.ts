/**
 * AI Assistance Disclosure
 * Tool: GitHub Copilot (GPT-6 Luna)
 * Scope: Require authentication and allow all defined roles on each supplier API route.
 * Author review: Reviewed and manually edited to allow the correct roles for each route
 */

import express, { type Request, type Response } from 'express';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.ts';
import { addSupplier, deactivateSupplier, getAllSuppliers, getSupplierById, searchSuppliers, updateSupplier } from '../controllers/supplierController.ts';

const router = express.Router();
const requireAnyRole = authorizeRoles("ADMIN", "REQUESTER", "COURIER");
const requireAdminRole = authorizeRoles("ADMIN")

// GET api/suppliers/
router.get("/", authMiddleware, requireAnyRole, getAllSuppliers)

// GET api/suppliers/
router.get("/:id", authMiddleware, requireAnyRole, getSupplierById)

// GET api/suppliers/search 
router.get("/search", authMiddleware, requireAnyRole, searchSuppliers);

// POST api/suppliers
router.post("/", authMiddleware, requireAdminRole, addSupplier);

// PATCH api/suppliers/:id 
router.patch("/:id", authMiddleware, requireAdminRole, updateSupplier);

// PATCH api/suppliers/deactivate/:id
router.patch("/deactivate/:id", authMiddleware, requireAdminRole, deactivateSupplier);

export default router