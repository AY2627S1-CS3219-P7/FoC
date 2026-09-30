// AI Assistance Disclosure:
// Tool: ChatGPT (model: GPT-5.6 Luna), date: 2026-09-30
// Scope: Added the TypeScript request augmentation for the finalized
// Gateway authentication middleware.
// Author review: Reviewed and validated against the req.user contract used
// by protected Gateway routes.

export interface AuthenticatedUser {
  id: string;
  jti: string;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      requestId?: string;
    }
  }
}

export {};