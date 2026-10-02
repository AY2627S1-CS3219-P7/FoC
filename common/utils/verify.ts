import jwt from "jsonwebtoken";

import { Role, type JwtPayload } from "../types/auth.js";

function isRole(value: unknown): value is Role {
  return Object.values(Role).includes(value as Role);
}

export function verifyAccessToken(token: string, secret: string): JwtPayload {
  if (!secret || !secret.trim()) {
    throw new Error("JWT_SECRET is not configured.");
  }

  const decoded = jwt.verify(token, secret);

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid JWT payload: token is not an object.");
  }

  const payload = decoded as Record<string, unknown>;

  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    throw new Error("Invalid JWT payload: 'sub' must be a non-empty string.");
  }

  if (!Array.isArray(payload.roles)) {
    throw new Error("Invalid JWT payload: 'roles' must be an array.");
  }

  if (!payload.roles.every((role) => typeof role === "string" && isRole(role))) {
    throw new Error("Invalid JWT payload: contains an invalid role.");
  }

  const verified: JwtPayload = {
    sub: payload.sub,
    roles: payload.roles as Role[],
  };

  if (typeof payload.jti === "string") {
    verified.jti = payload.jti;
  }

  if (typeof payload.iat === "number") {
    verified.iat = payload.iat;
  }

  if (typeof payload.exp === "number") {
    verified.exp = payload.exp;
  }

  return verified;
}
