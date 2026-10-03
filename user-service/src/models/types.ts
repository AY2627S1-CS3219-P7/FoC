export type Role = "ADMIN" | "REQUESTER" | "COURIER";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

export interface JwtPayload {
  sub: string;
  jti: string;
  exp: number;
  roles: Role[];
}
