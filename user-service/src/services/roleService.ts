import { query } from "../config/db.js";
import { AppError } from "../utils/errors.js";
import { Role } from "../models/types.js";
import { isValidUuid } from "../utils/validators.js";

export interface UserRoles {
    userId: string;
    roles: Role[];
}

export const getUserRoles = async (userId: string): Promise<UserRoles> => {
    if (!isValidUuid(userId)) {
        throw new AppError(400, "Invalid user ID.");
    }
    const userResult = await query(
        `SELECT id
         FROM users
         WHERE id = $1`,
        [userId]
    );

    if (userResult.rows.length === 0) {
        throw new AppError(404, "User not found.");
    }

    const roleResult = await query(
        `SELECT r.name
         FROM roles r
         INNER JOIN user_roles ur ON ur.role_id = r.id
         WHERE ur.user_id = $1
         ORDER BY r.name`,
        [userId]
    );

    return {
        userId,
        roles: roleResult.rows.map((row) => row.name as Role),
    };
};