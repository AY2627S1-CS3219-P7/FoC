import { type TransactionRecord } from "../models/types.ts";

export const getTransactionsByUserService = async (userId: string): Promise<TransactionRecord[]> => {
    throw new Error("Not implemented");
};

export const reserveCreditsService = async (data: any): Promise<TransactionRecord> => {
    throw new Error("Not implemented");
};

export const transferCreditsService = async (data: any): Promise<TransactionRecord> => {
    throw new Error("Not implemented");
};

export const releaseCreditsService = async (data: any): Promise<TransactionRecord> => {
    throw new Error("Not implemented");
};