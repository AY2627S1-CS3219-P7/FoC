import type { Role } from "../models/types.js";

export interface AuthenticatedUser {
  id: string;
  jti: string;
  exp: number;
  roles: Role[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
