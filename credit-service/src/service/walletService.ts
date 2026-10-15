// AI Assistance Disclosure:
// Tool: Gemini (model: 3.1 Pro), date: 2026-10-15
// Scope: Given function names and description, and SQL Schema, generated basic SQL queries, which were then edited to fit specifications
// Author review: Validated correctness of SQL queries, tested with Postman to check correctness

import pool from "../config/db.ts";
import { type Wallet } from "../models/types.ts";


export const initializeWalletService = async (userId: string): Promise<Wallet> => {
    const initialCredits = parseInt(process.env.INITIAL_CREDITS || '50', 10);
    const query = `
        INSERT INTO wallets (user_id, available_credits, reserved_credits)
        VALUES ($1, $2, 0)
        RETURNING *;
    `;
    const result = await pool.query<Wallet>(query, [userId, initialCredits]);
    return result.rows[0];
};

export const getWalletService = async (userId: string): Promise<Wallet | null> => {
    const query = `SELECT * FROM wallets WHERE user_id = $1;`;
    const result = await pool.query<Wallet>(query, [userId]);
    return result.rows[0] || null;
};