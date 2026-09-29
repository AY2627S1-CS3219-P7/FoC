// AI Assistance Disclosure:
// Tool: Gemini (model: 3.1 Pro), date: 2026-09-27
// Scope: Provided function names and the Supplier model, AI was used to implement the CRUD operations
// Author review: Code manually reviewed and verified

import pool from "../config/db.ts";
import { type Supplier, type CreateSupplierDTO } from "../models/types.ts"

export const getAllSuppliersService = async (): Promise<Supplier[]> => {
    const query = `SELECT * FROM suppliers;`
    const result = await pool.query<Supplier>(query);
    return result.rows;
};

export const searchSuppliersService = async (searchTerm: string): Promise<Supplier[]> => {
    const query = `
        SELECT * FROM suppliers 
        WHERE name ILIKE $1 OR type ILIKE $1 OR building ILIKE $1
        ORDER BY name ASC;
    `;
    const result = await pool.query<Supplier>(query, [`%${searchTerm}%`]);
    return result.rows;
};

export const addSupplierService = async (data: CreateSupplierDTO): Promise<Supplier> => {
    const query = `
        INSERT INTO suppliers (
            name, type, building, floor, location_description, 
            latitude, longitude, starting_time, closing_time, image_url, is_active
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, true)
        ) RETURNING *;
    `;
    
    const values = [
        data.name, data.type, data.building, data.floor, data.location_description,
        data.latitude, data.longitude, data.starting_time, data.closing_time, data.image_url, data.is_active
    ];

    const result = await pool.query<Supplier>(query, values);
    return result.rows[0];
};

export const updateSupplierService = async (id: string, data: Partial<CreateSupplierDTO>): Promise<Supplier | null> => {
    const keys = Object.keys(data);
    if (keys.length === 0) return null;

    const setString = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = keys.map(key => data[key as keyof typeof data]);

    const query = `
        UPDATE suppliers 
        SET ${setString}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 
        RETURNING *;
    `;

    const result = await pool.query<Supplier>(query, [id, ...values]);
    return result.rows[0] || null;
};

export const deactivateSupplierService = async (id: string): Promise<Supplier | null> => {
    const query = `
        UPDATE suppliers 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *;
    `;
    
    const result = await pool.query<Supplier>(query, [id]);
    return result.rows[0] || null;
};