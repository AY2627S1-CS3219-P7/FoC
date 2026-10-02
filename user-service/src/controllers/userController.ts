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

// ============================================================
// Get User Profile By ID
// ============================================================

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required.");
    }

    const { userId } = req.params;

    if (!userId || typeof userId !== "string" || !UUID_V4_REGEX.test(userId)) {
      throw new AppError(400, "Invalid userId format. Must be a valid UUID.");
    }

    const user = await userService.getUserProfileById(
      userId,
      req.user.id,
      req.user.roles || []
    );

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
