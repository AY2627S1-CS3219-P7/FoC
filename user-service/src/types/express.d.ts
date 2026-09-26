export interface AuthenticatedUser {
  id: string;
  jti: string;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
