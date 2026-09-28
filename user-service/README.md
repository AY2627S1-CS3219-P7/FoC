# User Service

## At a glance

This service is the source of truth for user auth, profile data, and role membership in FoC.

Core model:

- `users`: account and profile data
- `roles`: allowed role names
- `user_roles`: user-to-role mapping
- `revoked_tokens`: invalidated JWTs
- `system_metadata`: one-time bootstrap state

This service is built with:

- TypeScript
- Node.js
- Express
- PostgreSQL
- pg
- bcrypt
- JWT

## 1. Base URL

- http://localhost:3002

## 2. Existing API list

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/:id/roles`

## 3. Quick start

### Quick curl examples

#### Register

```bash
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@u.nus.edu",
    "password": "supersecurepassword123",
    "firstName": "Alice",
    "lastName": "Lee"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "alice",
    "password": "supersecurepassword123"
  }'
```

#### Get current user profile

```bash
curl http://localhost:3002/api/users/me \
  -H "Authorization: Bearer <token>"
```

#### Get user roles

```bash
curl http://localhost:3002/api/users/<user-id>/roles \
  -H "Authorization: Bearer <token>"
```

#### Logout

```bash
curl -X POST http://localhost:3002/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

## 4. API contract

### Health check

#### GET /health

Response:

```json
{
  "status": "UP"
}
```

---

### Register user

#### POST /api/auth/register

Request body:

```json
{
  "username": "alice",
  "email": "alice@u.nus.edu",
  "password": "supersecurepassword123",
  "firstName": "Alice",
  "lastName": "Lee"
}
```

Rules:

- all fields required
- email must be valid and use an allowed NUS domain
- password must be at least 15 chars
- username and email must be unique

Success response: `201`

```json
{
  "id": "uuid",
  "username": "alice",
  "email": "alice@u.nus.edu",
  "firstName": "Alice",
  "lastName": "Lee",
  "roles": ["REQUESTER", "COURIER"]
}
```

---

### Login

#### POST /api/auth/login

Request body:

```json
{
  "identifier": "alice",
  "password": "supersecurepassword123"
}
```

`identifier` can be username or email.

Success response: `200`

```json
{
  "accessToken": "<jwt-token>",
  "user": {
    "id": "uuid",
    "username": "alice",
    "email": "alice@u.nus.edu",
    "firstName": "Alice",
    "lastName": "Lee",
    "roles": ["REQUESTER", "COURIER"]
  }
}
```

---

### Logout

#### POST /api/auth/logout

Requires authentication. Adds the current JWT JTI to `revoked_tokens`.

Response: `204 No Content`

---

### Get current user profile

#### GET /api/users/me

Requires authentication.

Response:

```json
{
  "id": "uuid",
  "username": "alice",
  "email": "alice@u.nus.edu",
  "firstName": "Alice",
  "lastName": "Lee",
  "roles": ["REQUESTER", "COURIER"]
}
```

---

### Update current user profile

#### PATCH /api/users/me

Requires authentication.

Request body may include any subset of:

```json
{
  "username": "alice2",
  "email": "newemail@u.nus.edu",
  "firstName": "Alice",
  "lastName": "Liu"
}
```

Success response:

```json
{
  "id": "uuid",
  "username": "alice2",
  "email": "newemail@u.nus.edu",
  "firstName": "Alice",
  "lastName": "Liu",
  "roles": ["REQUESTER", "COURIER"]
}
```

---

### Get roles for a user

#### GET /api/users/:id/roles

Requires authentication.

Success response:

```json
{
  "userId": "uuid",
  "roles": ["REQUESTER", "COURIER"]
}
```

## 5. Authentication model

This service uses JWT auth. After validation, the middleware attaches the authenticated user to `req.user` with at least:

```ts
req.user = {
  id: string,
  jti: string,
  exp: number
}
```

Protected routes require the `Authorization: Bearer <token>` header.

## 6. Supported roles

- `ADMIN`
- `REQUESTER`
- `COURIER`

These are seeded in the `roles` table during migration.

## 7. Database snapshot

This is the quick mental model for the database as it currently exists.

| Table | Purpose | What is in it |
| --- | --- | --- |
| `users` | user accounts and profiles | `id`, `username`, `email`, password hash, names, active flag, timestamps |
| `roles` | role catalog | `ADMIN`, `REQUESTER`, `COURIER` |
| `user_roles` | user-to-role mapping | join table linking a user to one or more roles |
| `revoked_tokens` | logout / token invalidation | JWT JTI values that have been revoked |
| `password_reset_tokens` | future reset flow | hashed token + expiry + user reference |
| `system_metadata` | bootstrap state | one-time flag such as `INITIAL_BOOTSTRAP_COMPLETED` |

Current default state after migration:

- `roles` is seeded with `ADMIN`, `REQUESTER`, and `COURIER`
- `users` is empty until someone registers
- `user_roles` is empty until roles are assigned
- `revoked_tokens` and `password_reset_tokens` are empty by default
- `system_metadata` is empty until Day 0 bootstrap runs

## 8. Environment config

Typical `.env` values:

```env
PORT=3002
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5433
DB_DATABASE=user_service_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

INITIAL_ADMIN_EMAIL=
INITIAL_ADMIN_PASSWORD=
INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_FIRST_NAME=System
INITIAL_ADMIN_LAST_NAME=Admin
```

## 9. Day 0 admin bootstrap

This app includes a one-time initial admin bootstrap.

Important rules:

- it is intended to run once
- it uses a lock and metadata flag to prevent repeated execution
- it is not a general admin recovery flow
- admin credentials must be set in environment variables before bootstrapping

How to run it manually:

1. Set the bootstrap env vars in `.env`:

```env
INITIAL_ADMIN_EMAIL=admin@u.nus.edu
INITIAL_ADMIN_PASSWORD=VeryStrongPassword123!
INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_FIRST_NAME=System
INITIAL_ADMIN_LAST_NAME=Admin
```

2. Run the bootstrap script:

```bash
npm run db:seed
```

This script checks whether bootstrap has already completed, acquires a transaction lock, and then creates the initial admin only if the one-time flag is still unset.

## 10. Collaboration notes

- This service is the source of truth for account identity, auth, and role membership.
- Frontend and other services should call this API instead of inventing their own user state.
- Follow the route → controller → service → DB pattern when adding logic.
- If a new endpoint is added, update this README as well.

That is the mental model teammates need when integrating with this service.
