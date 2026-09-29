import express, { type Request, type Response } from 'express';
import { addSupplier, deactivateSupplier, getAllSuppliers, getSupplierById, searchSuppliers, updateSupplier } from '../controllers/supplierController.ts';

const router = express.Router();

// GET api/suppliers/
router.get("/", getAllSuppliers)

// GET api/suppliers/
router.get("/:id", getSupplierById)

// GET api/suppliers/search 
router.get("/search", searchSuppliers);

// POST api/suppliers
router.post("/", addSupplier);

// PATCH api/suppliers/:id 
router.patch("/:id", updateSupplier);

// PATCH api/suppliers/deactivate/:id
router.patch("/deactivate/:id", deactivateSupplier);

export default router