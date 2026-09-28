# AI Usage Log

## User roles API implementation
Date: 2026-09-29
Time: 12:54 PM SGT
Tool: ChatGPT
Model: GPT-5.6-Luna

Exact prompt:
> I am implementing one finalized API for a CS3219 microservice project.
>
> Important: The requirements, API contract, architecture, database schema, and component responsibilities below have already been finalized by the project team. Do not propose, change, or redesign any of them. Your task is only to implement the specified API according to these existing decisions.
>
> ## Project context
>
> This is the User Service of a campus errand platform.
>
> Tech stack:
> - TypeScript
> - Node.js
> - Express
> - PostgreSQL
> - pg
> - JWT authentication
>
> The User Service uses a layered structure:
> - routes/
> - controllers/
> - services/
> - middleware/
> - utils/
> - config/
> - models/
>
> The project uses HTTP/JSON for API communication.
>
> ## Existing database schema relevant to this API
>
> There are three relevant tables:
>
> users:
> - id UUID PRIMARY KEY
> - username
> - email
> - password_hash
> - first_name
> - last_name
> - is_active
>
> roles:
> - id SERIAL PRIMARY KEY
> - name VARCHAR(50) UNIQUE
>
> user_roles:
> - user_id UUID
> - role_id INTEGER
> - PRIMARY KEY (user_id, role_id)
> - user_id references users(id)
> - role_id references roles(id)
>
> The role names currently supported by the system are:
> - ADMIN
> - REQUESTER
> - COURIER
>
> ## Existing authentication
>
> The project already has JWT authentication middleware.
>
> After successful authentication, the middleware sets:
>
> req.user = {
>   id: string,
>   jti: string,
>   exp: number
> }
>
> For this API, req.user.id represents the authenticated user's ID.
>
> ## API to implement
>
> Endpoint:
>
> GET /api/users/:id/roles
>
> Purpose:
>
> Return the roles assigned to the specified user.
>
> Authentication:
> - The endpoint requires a valid authenticated JWT.
> - The authenticated user is allowed to query the specified user's roles.
> - No admin-only restriction is required for this endpoint.
>
> Path parameter:
> - id: UUID of the user whose roles are being queried.
>
> ## Expected responses
>
> Success:
>
> HTTP 200
>
> Response body:
>
> {
>   "userId": "uuid",
>   "roles": [
>     "REQUESTER",
>     "COURIER"
>   ]
> }
>
>
> The roles should come from the database rather than being hard-coded.
>
> If the specified user does not exist:
>
> HTTP 404
>
> {
>   "status": 404,
>   "message": "User not found."
> }
>
>
> If the request is unauthenticated, the existing authentication middleware should handle it with HTTP 401.
>
> ## Existing project conventions
>
> Use the project's existing:
> - AppError class for application errors
> - query() helper for PostgreSQL queries
> - Role type for role values
> - authMiddleware for authentication
> - namespace imports for controllers/services in routes
>
> Do not introduce a new framework, library, authentication mechanism, database table, or design pattern.
>
> Do not modify the existing database schema.
>
> Do not modify the API contract.
>
> ## Implementation scope
>
> Implement only what is necessary for this API:
> 1. roleService.ts
> 2. roleController.ts
> 3. roleRoutes.ts
>
> If an existing file already contains part of this functionality, modify it instead of creating duplicate functionality.
>
> Follow the existing project's coding style and TypeScript conventions.
>
> Do not implement the POST or DELETE role APIs yet.
>
> Do not implement tests unless necessary for the implementation.
>
> Please provide the implementation code and briefly identify which files need to be created or modified.

Key response:
Implemented the authenticated GET /api/users/:id/roles flow using the project's existing layered conventions: a service queries the roles table via the shared query() helper, a controller handles the request/response contract using AppError for 404/401 behavior, and a route is registered with authMiddleware. The endpoint returns the user's UUID and database-backed role names, and it follows the existing TypeScript and Express patterns without altering the schema or API contract.

Files affected:
- user-service/src/services/roleService.ts
- user-service/src/controllers/roleController.ts
- user-service/src/routes/roleRoutes.ts

Author review:
The output was reviewed against the project conventions and the finalized API contract. The implementation matched the required authentication, database-backed role lookup, and user-not-found error behavior with no scope creep beyond the specified endpoint.
