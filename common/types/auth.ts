export const Role = {
  ADMIN: "ADMIN",
  REQUESTER: "REQUESTER",
  COURIER: "COURIER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface JwtPayload {
  sub: string;
  roles: Role[];
  jti?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  roles: Role[];
  jti?: string;
  exp?: number;
}
