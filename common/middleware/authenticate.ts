import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedUser } from "../types/auth.js";
import { verifyAccessToken } from "../utils/verify.js";

const unauthorized = (res: Response): void => {
  res.status(401).json({ status: 401, message: "Authentication required." });
};

const serverConfigError = (res: Response): void => {
  res.status(500).json({
    status: 500,
    message: "Server configuration error: JWT_SECRET is not configured.",
  });
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (!authorization?.startsWith("Bearer ")) {
    unauthorized(res);
    return;
  }

  if (!secret || !secret.trim()) {
    serverConfigError(res);
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    unauthorized(res);
    return;
  }

  try {
    const payload = verifyAccessToken(token, secret);

    req.user = {
      id: payload.sub,
      roles: payload.roles,
      ...(payload.jti ? { jti: payload.jti } : {}),
      ...(payload.exp !== undefined ? { exp: payload.exp } : {}),
    };

    next();
  } catch {
    unauthorized(res);
  }
};

export default authenticate;
