import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { env } from "../config/env.js";
import type { JwtPayload } from "../models/types.js";

export const generateAccessToken = (userId: string): string => {
  const jti = randomUUID();

  return jwt.sign(
    {
      sub: userId,
      jti,
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