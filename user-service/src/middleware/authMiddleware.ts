import type { NextFunction, Request, Response } from "express";

import { query } from "../config/db.js";
import { AppError } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/jwt.js";

// ============================================================
// Logout / Revocation Middleware
// ============================================================

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication required.");
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      throw new AppError(401, "Authentication required.");
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw new AppError(401, "Authentication required.");
    }

    if (!payload.jti) {
      throw new AppError(401, "Authentication required.");
    }

    const revokedToken = await query(
      "SELECT 1 FROM revoked_tokens WHERE jti = $1",
      [payload.jti]
    );

    if (revokedToken.rows.length > 0) {
      throw new AppError(401, "Token has been revoked.");
    }

    req.user = {
      id: payload.sub,
      roles: Array.isArray(payload.roles) ? payload.roles : [],
      jti: payload.jti,
      exp: payload.exp,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;