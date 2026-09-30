import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { env } from "../config/env.js";
import type { JwtPayload, Role } from "../models/types.js";

export const generateAccessToken = (userId: string, roles: Role[] = []): string => {
  const jti = randomUUID();

  return jwt.sign(
    {
      sub: userId,
      jti,
      roles,
    },
    env.jwt.secret,
    {
      expiresIn: env.jwt.expiresIn,
    }
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
};