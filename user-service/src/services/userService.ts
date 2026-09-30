import type { PoolClient } from "pg";
import { query } from "../config/db.js";
import { AppError } from "../utils/errors.js";
import type { Role } from "../models/types.js";
import {
    isAllowedNusEmail,
    isNonEmptyString,
    isValidEmail,
    isValidPassword,
} from "../utils/validators.js";
import { hashPassword } from "../utils/password.js";

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

export interface UpdateProfileInput {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// ============================================================
// Get Current User Profile
// ============================================================

export const getCurrentUserProfile = async (
  userId: string
): Promise<UserProfileResponse> => {
  const userResult = await query(
    `SELECT id, username, email, first_name, last_name
     FROM users
     WHERE id = $1 AND is_active = true`,
    [userId]
  );

  if (userResult.rows.length === 0) {
    throw new AppError(404, "User not found or account is deactivated.");
  }

  const user = userResult.rows[0];

  const rolesResult = await query(
    `SELECT r.name
     FROM roles r
     JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = $1
     ORDER BY r.name ASC`,
    [userId]
  );

  const roles = rolesResult.rows.map((row: { name: Role }) => row.name);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    roles,
  };
};

// ============================================================
// Update Current User Profile
// ============================================================

export const updateCurrentUserProfile = async (
  userId: string,
  input: UpdateProfileInput
): Promise<UserProfileResponse> => {
  const username = input.username?.trim();
  const email = input.email?.trim().toLowerCase();
  const firstName = input.firstName?.trim();
  const lastName = input.lastName?.trim();

  // Require at least one field.
  if (
    username === undefined &&
    email === undefined &&
    firstName === undefined &&
    lastName === undefined
  ) {
    throw new AppError(400, "At least one field must be provided for update.");
  }

  // Validate that updated fields are not empty.
  if (
    (username !== undefined && username.length === 0) ||
    (email !== undefined && email.length === 0) ||
    (firstName !== undefined && firstName.length === 0) ||
    (lastName !== undefined && lastName.length === 0)
  ) {
    throw new AppError(400, "Updated fields must not be empty.");
  }

  // Validate email format and NUS domain.
  if (email !== undefined) {
    if (!isValidEmail(email)) {
      throw new AppError(400, "Invalid email format.");
    }

    if (!isAllowedNusEmail(email)) {
      throw new AppError(400, "Email must be a valid NUS email address.");
    }
  }

  let updateResult;

  try {
    updateResult = await query(
      `UPDATE users
       SET username = COALESCE($1, username),
           email = COALESCE($2, email),
           first_name = COALESCE($3, first_name),
           last_name = COALESCE($4, last_name),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND is_active = true
       RETURNING id`,
      [
        username ?? null,
        email ?? null,
        firstName ?? null,
        lastName ?? null,
        userId,
      ]
    );
  } catch (error) {
    const dbError = error as {
      code?: string;
      detail?: string;
      constraint?: string;
    };

    if (dbError.code === "23505") {
      if (
        dbError.constraint === "users_username_key" ||
        dbError.detail?.includes("(username)")
      ) {
        throw new AppError(409, "Username is already in use.");
      }

      if (
        dbError.constraint === "users_email_key" ||
        dbError.detail?.includes("(email)")
      ) {
        throw new AppError(409, "Email is already in use.");
      }

      throw new AppError(409, "Username or email is already in use.");
    }

    throw error;
  }

  if (updateResult.rows.length === 0) {
    throw new AppError(404, "User not found or account is deactivated.");
  }

  return getCurrentUserProfile(userId);
};

// AI-generated
// ============================================================
// Initial Admin Provisioning
// ============================================================

interface ProvisionInitialAdminInput {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
}

export const provisionInitialAdmin = async (
    input: ProvisionInitialAdminInput,
    client: PoolClient
): Promise<void> => {
    const {
        email,
        password,
        username,
        firstName,
        lastName,
    } = input;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (!isNonEmptyString(normalizedEmail)) {
        throw new AppError(400, "Email is required.");
    }

    if (!isValidEmail(normalizedEmail)) {
        throw new AppError(400, "Invalid email address.");
    }

    if (!isAllowedNusEmail(normalizedEmail)) {
        throw new AppError(400, "Email must be a valid NUS email address.");
    }

    if (!isNonEmptyString(normalizedUsername)) {
        throw new AppError(400, "Username is required.");
    }

    if (!isNonEmptyString(firstName)) {
        throw new AppError(400, "First name is required.");
    }

    if (!isNonEmptyString(lastName)) {
        throw new AppError(400, "Last name is required.");
    }

    if (!isValidPassword(password)) {
        throw new AppError(400, "Password must be at least 15 characters.");
    }

    const existingUser = await client.query(
        `SELECT id
         FROM users
         WHERE email = $1 OR username = $2
         LIMIT 1`,
        [normalizedEmail, normalizedUsername]
    );

    if (existingUser.rows.length > 0) {
        throw new AppError(
            409,
            "Username or email already exists."
        );
    }

    const passwordHash = await hashPassword(password);

    const userResult = await client.query<{ id: string }>(
        `INSERT INTO users (
            username,
            email,
            password_hash,
            first_name,
            last_name
         )
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [
            normalizedUsername,
            normalizedEmail,
            passwordHash,
            firstName.trim(),
            lastName.trim(),
        ]
    );

    const userId = userResult.rows[0].id;

    const roleResult = await client.query<{ id: number; name: string }>(
        `SELECT id, name
         FROM roles
         WHERE name IN ('ADMIN', 'REQUESTER', 'COURIER')`,
    );

    if (roleResult.rows.length !== 3) {
        const existingRoleNames = new Set(
            roleResult.rows.map((role) => role.name)
        );
        const missingRoles = ["ADMIN", "REQUESTER", "COURIER"].filter(
            (roleName) => !existingRoleNames.has(roleName)
        );

        throw new AppError(
            500,
            `Required roles are missing: ${missingRoles.join(", ")}`
        );
    }

    for (const role of roleResult.rows) {
        await client.query(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES ($1, $2)`,
            [userId, role.id]
        );
    }
};
