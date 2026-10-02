import jwt from "jsonwebtoken";

import type { Role } from "../types/auth.js";

export interface GenerateAccessTokenOptions {
  userId: string;
  roles: Role[];
  secret: string;
  expiresIn?: string | number;
  jwtId?: string;
}

export function generateAccessToken({
  userId,
  roles,
  secret,
  expiresIn = "15m",
  jwtId,
}: GenerateAccessTokenOptions): string {
  if (!secret || !secret.trim()) {
    throw new Error("JWT_SECRET is not configured.");
  }

  const payload: { sub: string; roles: Role[]; jti?: string } = {
    sub: userId,
    roles,
  };

  if (jwtId) {
    payload.jti = jwtId;
  }

  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}
