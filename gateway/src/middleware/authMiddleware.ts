import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export interface AuthenticatedUser {
  id: string;
  jti: string;
  exp: number;
}

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