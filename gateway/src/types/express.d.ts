// AI Assistance Disclosure:
// Tool: ChatGPT (model: GPT-5.6 Luna), date: 2026-09-30
// Scope: Keep the gateway-only requestId augmentation while reusing the shared auth contract.
// Author review: Reviewed and validated against the req.user contract used
// by protected Gateway routes.

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export {};