import { type NextFunction, type Request, type Response } from 'express';
import { 
    getAllSuppliersService,
    searchSuppliersService,
    addSupplierService,
    updateSupplierService,
    deactivateSupplierService
} from '../service/supplierService.ts';

export const getAllSuppliers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const suppliers = await getAllSuppliersService();
        res.status(200).json(suppliers);
    } catch (error: any) {
        const errorWithMessage = new Error(`Failed to fetch suppliers: ${error.message}`);
        next(errorWithMessage);
    }
};

export const searchSuppliers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const suppliers = await searchSuppliersService();
        res.status(200).json(suppliers);
    } catch (error: any) {
        const errorWithMessage = new Error(`Failed to search suppliers: ${error.message}`);
        next(errorWithMessage);
    }
};

export const addSupplier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newSupplier = await addSupplierService();
        res.status(200).json(newSupplier);
    } catch (error: any) {
        const errorWithMessage = new Error(`Failed to add supplier: ${error.message}`);
        next(errorWithMessage);
    }
};

export const updateSupplier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedSupplier = await updateSupplierService();
        res.status(200).json(updatedSupplier);
    } catch (error: any) {
        const errorWithMessage = new Error(`Failed to update supplier: ${error.message}`);
        next(errorWithMessage);
    }
};

export const deactivateSupplier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deactivatedSupplier = await deactivateSupplierService();
        res.status(200).json(deactivatedSupplier);
    } catch (error: any) {
        const errorWithMessage = new Error(`Failed to deactivate supplier: ${error.message}`);
        next(errorWithMessage);
    }
};