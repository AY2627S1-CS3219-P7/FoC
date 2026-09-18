import pool from "../config/db.ts";
import { type Supplier } from "../models/types.ts"

export const getAllSuppliersService = async (): Promise<Supplier[]> => {
    const query = `SELECT * FROM suppliers;`
    const result = await pool.query<Supplier>(query);
    return result.rows;
};

export const searchSuppliersService = async () => {};

export const addSupplierService = async () => {};

export const updateSupplierService = async () => {};

export const deactivateSupplierService = async () => {};