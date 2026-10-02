import type { NextFunction, Request, Response } from "express";

import { Role, type AuthenticatedUser } from "../types/auth.js";
import { verifyAccessToken } from "../utils/verify.js";

const unauthorized = (res: Response): void => {
  res.status(401).json({ status: 401, message: "Authentication required." });
};

const parseTrustedGatewayRoles = (rawRoles: string | string[] | undefined): Role[] => {
  const rawValues = Array.isArray(rawRoles)
    ? rawRoles.flatMap((value) => String(value).split(","))
    : typeof rawRoles === "string"
      ? rawRoles.split(",")
      : [];

  const normalized = rawValues
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return normalized.filter((role): role is Role => Object.values(Role).includes(role as Role));
};

const resolveTrustedUser = (req: Request): AuthenticatedUser | null => {
  const rawUserId = req.headers["x-user-id"];
  const userId =
    typeof rawUserId === "string"
      ? rawUserId.trim()
      : Array.isArray(rawUserId)
        ? rawUserId.find((value) => typeof value === "string" && value.trim().length > 0)?.trim()
        : undefined;

  if (!userId) {
    return null;
  }

  return {
    id: userId,
    roles: parseTrustedGatewayRoles(req.headers["x-user-roles"]),
  };
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const trustedUser = resolveTrustedUser(req);
  if (trustedUser) {
    req.user = trustedUser;
    next();
    return;
  }

  const authorization = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (!authorization?.startsWith("Bearer ")) {
    unauthorized(res);
    return;
  }

  if (!secret || !secret.trim()) {
    unauthorized(res);
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
