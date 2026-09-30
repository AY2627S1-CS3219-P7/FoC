# AI Usage Log

## Minimal API Gateway implementation
Date: 2026-09-30
Time: 4:15 PM SGT
Tool: ChatGPT
Model: GPT-5.6-Luna

Exact prompt:
> Implement Phase 1: Minimal Working Gateway based on the Phase 0 inspection findings.
>
> Requirements:
> - Create a minimal Node.js + TypeScript + Express gateway under gateway/.
> - Use environment config with PORT default 8080, FRONTEND_ORIGIN default http://localhost:5173, USER_SERVICE_URL default http://localhost:3002, SUPPLIER_SERVICE_URL default http://localhost:3001.
> - Expose GET /health with { status: "UP", service: "api-gateway" } and do not proxy /health.
> - Configure CORS for allowed methods GET, POST, PUT, PATCH, DELETE, OPTIONS and headers Content-Type, Authorization.
> - Proxy /api/auth, /api/users, and /api/suppliers to the corresponding upstream services.
> - Preserve JSON request bodies safely when proxying using http-proxy-middleware.
> - Do not implement JWT auth, rate limiting, or database logic for this phase.
>
> Deliverables:
> - gateway/package.json
> - gateway/tsconfig.json
> - gateway/.env.example
> - gateway/src/config/env.ts
> - gateway/src/server.ts
>
> Also provide the exact curl verification commands for health, CORS preflight, auth forwarding, and supplier forwarding.

Key response:
Created the minimal gateway scaffold with a dedicated health endpoint, CORS setup, environment configuration, and reverse-proxy routing for the auth, user, and supplier APIs. The implementation uses http-proxy-middleware with a body-safe proxy interceptor and validates the build and runtime behavior with curl-based checks against the live user and supplier services.

Files affected:
- gateway/package.json
- gateway/tsconfig.json
- gateway/.env.example
- gateway/src/config/env.ts
- gateway/src/server.ts

Author review:
The output was reviewed and validated against the Phase 0 inspection findings and Phase 1 scope. The gateway build succeeds, the health endpoint responds with the required payload, and CORS preflight works. Route-forwarding was then adjusted to preserve the correct upstream API path prefixes so the gateway reaches the correct downstream endpoints.

## Gateway JWT authentication implementation
Date: 2026-09-30
Time: 4:15 PM SGT
Tool: ChatGPT
Model: GPT-5.6-Luna

Exact prompt:
> Implement Phase 2 of the API Gateway for the CS3219 campus errand platform.
>
> Scope:
> - Add `jsonwebtoken` to the Gateway.
> - Add `JWT_SECRET` to the Gateway environment configuration.
> - Implement Gateway JWT authentication middleware that reads Authorization: Bearer <token>, rejects missing or malformed Authorization headers with HTTP 401, verifies signature and expiration using the shared JWT secret, validates that the decoded token contains sub, jti, and exp, and stores the authenticated identity as req.user with id, jti, and exp.
> - Add Express TypeScript request augmentation for req.user typing.
> - Apply authentication selectively: public auth register/login; protected auth logout; /api/users/* protected; supplier routes unchanged.
> - Preserve reverse-proxy behavior and request body forwarding.
> - Do not add a Gateway token blacklist, Redis, role authorization, or business logic.
> - Use 2-space indentation for JavaScript/TypeScript.
>
> Also verify the expected behaviors for missing JWT, invalid JWT, valid JWT acceptance, public auth flows, protected route enforcement, and logout behavior through the User Service's revocation mechanism.

Key response:
Implemented the Gateway Phase 2 JWT auth middleware, added the required environment variable and TypeScript request augmentation, and applied auth selectively to public auth endpoints and protected user routes while leaving supplier routes unchanged. The middleware validates the Authorization bearer token, enforces 401 on malformed or invalid tokens, and attaches the decoded identity to req.user. The gateway build was verified and the protected-route checks were exercised against the live User Service and downstream revocation flow.

Files affected:
- gateway/package.json
- gateway/src/config/env.ts
- gateway/src/middleware/authMiddleware.ts
- gateway/src/types/express.d.ts
- gateway/src/server.ts

Author review:
The output was reviewed against the Phase 2 architecture constraints. It preserves the existing Gateway proxy behavior, adds JWT verification using the shared secret only, and keeps the implementation limited to authentication enforcement without introducing a second revocation model or role logic.
