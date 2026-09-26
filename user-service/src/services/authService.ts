import { pool, query } from "../config/db.js";
import { generateAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";
import {
  isNonEmptyString,
  isAllowedNusEmail,
  isValidPassword,
} from "../utils/validators.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import type { Role, User } from "../models/types.js";

// ============================================================
// Registration
// ============================================================

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const register = async (input: RegisterInput): Promise<User> => {
  const { username, email, password, firstName, lastName } = input;

  // Validate that all required fields are non-empty.
  if (
    !isNonEmptyString(username) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(password) ||
    !isNonEmptyString(firstName) ||
    !isNonEmptyString(lastName)
  ) {
    throw new AppError(400, "All fields are required and must not be empty.");
  }

  // Normalize input values once and reuse them throughout the registration flow.
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();

  // Validate business rules after normalization.
  if (!isAllowedNusEmail(normalizedEmail)) {
    throw new AppError(400, "Email domain is not allowed.");
  }

  if (!isValidPassword(password)) {
    throw new AppError(400, "Password must be at least 15 characters long.");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check for duplicate username or email within the transaction.
    const existingUser = await client.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [normalizedUsername, normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      /*
       * Use a unified message to avoid revealing whether a specific
       * username or email is already registered.
       */
      throw new AppError(409, "Username or email is already in use.");
    }

    // Hash the password only after the duplicate check succeeds.
    const passwordHash = await hashPassword(password);

    // Insert the new user.
    const userResult = await client.query(
      `INSERT INTO users (
        username,
        email,
        password_hash,
        first_name,
        last_name
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, first_name, last_name`,
      [
        normalizedUsername,
        normalizedEmail,
        passwordHash,
        normalizedFirstName,
        normalizedLastName,
      ]
    );

    const userRow = userResult.rows[0];

    // Load and validate the two default roles assigned to every new user.
    const roleResult = await client.query(
      "SELECT id, name FROM roles WHERE name IN ('REQUESTER', 'COURIER')"
    );

    if (roleResult.rows.length !== 2) {
      throw new AppError(500, "Default roles are not configured correctly.");
    }

    // Assign both default roles to the new user.
    for (const role of roleResult.rows) {
      await client.query(
        "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
        [userRow.id, role.id]
      );
    }

    await client.query("COMMIT");

    // Return the user domain model without exposing the password hash.
    return {
      id: userRow.id,
      username: userRow.username,
      email: userRow.email,
      firstName: userRow.first_name,
      lastName: userRow.last_name,
      roles: roleResult.rows.map((row: { name: Role }) => row.name),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ============================================================
// Login
// ============================================================

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

const getUserRoles = async (userId: string): Promise<Role[]> => {
  const result = await query(
    `SELECT r.name
     FROM roles r
     INNER JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = $1`,
    [userId]
  );

  return result.rows.map((row: { name: Role }) => row.name);
};

export const login = async (
  input: LoginInput
): Promise<LoginResponse> => {
  const { identifier, password } = input;

  // Validate required fields.
  if (!isNonEmptyString(identifier) || !isNonEmptyString(password)) {
    throw new AppError(400, "Identifier and password are required.");
  }

  const normalizedIdentifier = identifier.trim();

  const userResult = await query(
    `SELECT id, username, email, password_hash, first_name, last_name
     FROM users
     WHERE username = $1 OR email = LOWER($1)`,
    [normalizedIdentifier]
  );

  if (userResult.rows.length === 0) {
    throw new AppError(401, "Invalid credentials.");
  }

  const userRow = userResult.rows[0];

  const passwordMatches = await comparePassword(
    password,
    userRow.password_hash
  );

  if (!passwordMatches) {
    throw new AppError(401, "Invalid credentials.");
  }

  const roles = await getUserRoles(userRow.id);

  const accessToken = generateAccessToken(userRow.id);

  return {
    accessToken,
    user: {
      id: userRow.id,
      username: userRow.username,
      email: userRow.email,
      firstName: userRow.first_name,
      lastName: userRow.last_name,
      roles,
    },
  };
};
