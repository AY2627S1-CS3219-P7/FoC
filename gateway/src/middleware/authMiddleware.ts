// AI Assistance Disclosure:
// Tool: ChatGPT (model: GPT-5.6 Luna), date: 2026-09-30
// Scope: Generated the Gateway JWT verification middleware according to
// the finalized Phase 2 authentication design.
// Author review: Reviewed and validated against the project JWT contract
// and expected 401 behavior for invalid or missing tokens.

// AI Assistance Disclosure:
// Tool: ChatGPT (model: GPT-5.6 Luna), date: 2026-10-02
// Scope: Refactored the Gateway JWT guard to use the shared common
// verification contract and enforce jti/exp validation before attaching
// the authenticated user to the Express request context.
// Author review: Reviewed and validated against the common auth contract,
// required 401 response format, and downstream service trust boundary.

import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../../../common/index.js";
import type { AuthenticatedUser } from "../../../common/types/auth.js";
import { env } from "../config/env.js";

const unauthorized = (
  res: Response,
  message: string = "Invalid or expired token"
): void => {
  res.status(401).json({
    status: 401,
    message
  });
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    unauthorized(res, "Missing or invalid Authorization header");
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    unauthorized(res, "Missing or invalid Authorization header");
    return;
  }

  try {
    const payload = verifyAccessToken(token, env.jwtSecret);

    if (typeof payload.jti !== "string" || payload.jti.trim().length === 0) {
      unauthorized(res, "Invalid token");
      return;
    }

    if (
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      unauthorized(res, "Invalid or expired token");
      return;
    }

    const user: AuthenticatedUser = {
      id: payload.sub,
      roles: payload.roles,
      jti: payload.jti,
      exp: payload.exp
    };

    req.user = user;
    next();
  } catch {
    unauthorized(res, "Invalid or expired token");
  }
};