import { query } from "../config/db.js";
import { AppError } from "../utils/errors.js";
import type { Role } from "../models/types.js";
import {
  isAllowedNusEmail,
  isValidEmail,
} from "../utils/validators.js";

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