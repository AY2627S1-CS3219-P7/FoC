import type { Request, Response, NextFunction } from "express";
import * as authService from "../service/authService.js";

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