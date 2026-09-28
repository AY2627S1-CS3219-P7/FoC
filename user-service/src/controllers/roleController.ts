import { Request, Response, NextFunction } from "express";
import * as roleService from "../services/roleService.js";
import { AppError } from "../utils/errors.js";

export const getUserRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        if (Array.isArray(id)) {
            throw new AppError(400, "Invalid user ID.");
        }

        const result = await roleService.getUserRoles(id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};