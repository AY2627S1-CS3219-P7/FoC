import type { Role, User } from '../interfaces'

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080/api"

const TOKEN_KEY = 'auth_token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export class UnauthorizedError extends Error {} // 401: missing, expired or revoked token
export class ForbiddenError extends Error {}    // 403: logged in, but the role isn't allowed
export class NotFoundError extends Error {}     // 404

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function request(path: string, init: RequestInit = {}, authenticated = false) {
  const token = authenticated ? getToken() : null
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      // Only send Content-Type when there is a body (avoids needless preflights)
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      clearToken()
    }
    const errorBody = await response.json().catch(() => null)
    throw new ApiError(response.status, errorBody?.message ?? `Request failed: ${response.status}`)
  }
  return response
}

// Auth
export async function login(input: { identifier: string; password: string }): Promise<User> {
  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  const data: { accessToken: string; user: User } = await response.json()
  setToken(data.accessToken)
  return data.user
}

interface RegisterInput {
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
}

export async function register(input: RegisterInput): Promise<User> {
  const response = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response.json()
}

export async function logout() {
  try {
    if (getToken()) {
      await request('/auth/logout', { method: 'POST' }, true)
    }
  } catch (error) {
    console.error(error)
  } finally {
    clearToken()
  }
}

// Restores the session on page load. Returns null when nobody is logged in.
export async function fetchCurrentUser(): Promise<User | null> {
  if (!getToken()) return null
  try {
    const response = await request('/users/me', {}, true)
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
      clearToken()
      return null
    }
    throw error
  }
}

interface UpdateProfileInput {
  username?: string,
  email?: string,
  firstName?: string,
  lastName?: string
}

// Update profile
export async function updateCurrentUser(input: UpdateProfileInput): Promise<User> {
  const response = await request(
    '/users/me',
    { method: 'PATCH', body: JSON.stringify(input) },
    true,
  )
  return response.json()
}


// Role Helpers

export function hasRole(user: User | null, role: Role): boolean {
  return !!user?.roles.includes(role)
}

export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'ADMIN')
}
