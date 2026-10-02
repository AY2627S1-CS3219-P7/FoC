// AI Assistance Disclosure:
// Tool: ChatGPT (model: GPT-5.6 Luna), date: 2026-09-30
// Scope: Generated the Gateway JWT verification middleware according to
// the finalized Phase 2 authentication design.
// Author review: Reviewed and validated against the project JWT contract
// and expected 401 behavior for invalid or missing tokens.

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import type { AuthenticatedUser, Role } from "../../../common/types/auth.js";
import { env } from "../config/env.js";

const isRole = (value: unknown): value is Role =>
  value === "ADMIN" || value === "REQUESTER" || value === "COURIER";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 401,
      message: "Missing or invalid Authorization header"
    });
  }

  const token = authorization.substring("Bearer ".length);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.sub !== "string" ||
      !Array.isArray(decoded.roles) ||
      !decoded.roles.every((role) => isRole(role)) ||
      typeof decoded.jti !== "string" ||
      typeof decoded.exp !== "number"
    ) {
      return res.status(401).json({
        status: 401,
        message: "Invalid token"
      });
    }

    const user: AuthenticatedUser = {
      id: decoded.sub,
      roles: decoded.roles as Role[],
      jti: decoded.jti,
      exp: decoded.exp
    };

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      status: 401,
      message: "Invalid or expired token"
    });
  }
};