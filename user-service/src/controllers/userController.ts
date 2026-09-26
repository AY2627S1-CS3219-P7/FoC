import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService.js";
import { AppError } from "../utils/errors.js";

// ============================================================
// Get Current User Profile
// ============================================================

export const getCurrentUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required.");
    }

    const user = await userService.getCurrentUserProfile(req.user.id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// ============================================================
// Update Current User Profile
// ============================================================

export const updateCurrentUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required.");
    }

    const { username, email, firstName, lastName } = req.body;

    const user = await userService.updateCurrentUserProfile(
      req.user.id,
      {
        username,
        email,
        firstName,
        lastName,
      }
    );

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};