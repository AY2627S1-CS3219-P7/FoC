import type { NextFunction, Request, Response } from "express";

import { Role } from "../types/auth.js";

export function requireRoles(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as Request & { user?: { roles: Role[] } }).user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const hasRequiredRole = user.roles.some((role: Role) => allowedRoles.includes(role));

    if (!hasRequiredRole) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}
