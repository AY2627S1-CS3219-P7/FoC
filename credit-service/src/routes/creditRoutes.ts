/**
 * AI Assistance Disclosure
 * Tool: GitHub Copilot (GPT-6 Luna)
 * Scope: Require authentication and allow all defined roles on each supplier API route. (file was copied from supplier service)
 * Author review: Reviewed and manually edited to allow the correct roles for each route (file was copied from supplier service)
 */

/**
 * AI Assistance Disclosure
 * Tool: GitHub Copilot, date: 2026-10-20
 * Scope: Protect user-scoped wallet and transaction reads; keep write routes internal to service callers.
 * Author review: Review pending.
 */

import express from "express";
import { authMiddleware, authorizeSelf  } from '../middleware/authMiddleware.ts';
import { initializeWallet, getWallet} from "../controllers/walletController.ts";
import { getTransactionsByUser, reserveCredits, transferCredits, releaseCredits } from "../controllers/transactionController.ts";

const router = express.Router();
// const requireAnyRole = authorizeRoles("ADMIN", "REQUESTER", "COURIER");
// const requireAdminRole = authorizeRoles("ADMIN")

router.get("/health", (req, res) => {
  console.log("credit service running")
  res.status(200).json({ status: "ok" });
});

// POST api/credit/wallet/:user_id
router.post("/wallet/:user_id", initializeWallet);

// GET api/credit/wallet/:user_id
router.get("/wallet/:user_id", authMiddleware, authorizeSelf, getWallet);

// GET api/credit/tx/:user_id
router.get("/tx/:user_id", authMiddleware, authorizeSelf, getTransactionsByUser);

// POST api/credit/tx/reserve
router.post("/tx/reserve", reserveCredits);

// POST api/credit/tx/transfer
router.post("/tx/transfer", transferCredits);

// POST api/credit/tx/release
router.post("/tx/release", releaseCredits);
export default router;