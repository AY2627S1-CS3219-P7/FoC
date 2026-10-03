# Shared Common Auth Utilities

This folder contains the shared authentication, RBAC, and JWT utilities used by the microservices in this repository.

It is designed to be reused by any new service, especially services that follow the same pattern as `supplier-service`.

## Contents

- `middleware/authenticate.ts` — verifies the request user from the gateway or Bearer token
- `middleware/rbac.ts` — role-based access control helpers
- `types/auth.ts` — shared auth types (`Role`, `AuthenticatedUser`, `JwtPayload`)
- `utils/sign.ts` — JWT signing helper
- `utils/verify.ts` — JWT verification helper
- `index.ts` — central re-export surface

## Import pattern used by services

A new service should import from the shared common package using the alias configured in its TypeScript config:

```ts
import { authenticate, requireRoles } from "@common/index.js";
```

This is the same pattern already used by the supplier service.

## Required TypeScript config

Add the path mapping in the service's `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "paths": {
      "@common/*": ["../common/*"]
    },
    "rewriteRelativeImportExtensions": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts", "../common/**/*.ts"]
}
```

This allows each service to resolve the shared files without duplicating auth logic.

## Example: route usage

This is the supplier-service pattern:

```ts
import express from "express";
import { authenticate, requireRoles } from "@common/index.js";

const router = express.Router();
const requireAnyRole = requireRoles("ADMIN", "REQUESTER", "COURIER");
const requireAdminRole = requireRoles("ADMIN");

router.get("/", authenticate, requireAnyRole, getAllItems);
router.post("/", authenticate, requireAdminRole, createItem);
```

## Request user contract

After `authenticate` runs, the request will contain `req.user` with the following shape:

```ts
req.user = {
  id: "user-id",
  roles: ["ADMIN", "REQUESTER"],
  jti?: "jwt-id",
  exp?: 1234567890,
};
```

Services can then read that user identity to authorize actions or attach ownership checks.

## Role model

The current shared roles are:

```ts
export const Role = {
  ADMIN: "ADMIN",
  REQUESTER: "REQUESTER",
  COURIER: "COURIER",
} as const;
```

## How to follow the pattern for new services

1. Copy the same folder structure as `supplier-service` for routes/controllers/service.
2. Add the `@common/*` path alias in the service `tsconfig.json`.
3. Use `authenticate` on protected routes.
4. Use `requireRoles(...)` for quick authorization checks.
5. In the service, treat the shared auth layer as the source of truth for user identity and roles.

## Expected similarity for other services

`order-service` and `credit-service` should generally follow the same structure and auth style as `supplier-service`:

- protected reads/writes use `authenticate`
- admin-only operations use `requireRoles("ADMIN")`
- mixed roles use `requireRoles("ADMIN", "REQUESTER")` or similar combinations
- all services should rely on the shared common auth contract instead of creating local duplicates

This keeps the authentication behavior consistent across the whole platform.
