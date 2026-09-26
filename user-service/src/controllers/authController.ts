import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService.js";

// ============================================================
// Registration
// ============================================================

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    const user = await authService.register({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// ============================================================
// Login
// ============================================================

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    const result = await authService.login({
      identifier,
      password,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
