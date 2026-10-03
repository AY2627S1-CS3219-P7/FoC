import type { Role, User } from '../interfaces'
import {
  request,
  getToken,
  getRefreshToken,
  setTokens,
  clearToken,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ApiError,
} from './client'

export {
  getToken,
  getRefreshToken,
  setTokens,
  clearToken,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ApiError,
}

// Auth
export async function login(input: { identifier: string; password: string }): Promise<User> {
  const response = await request(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    false
  )
  const data: { accessToken: string; refreshToken?: string; user: User } = await response.json()
  setTokens(data.accessToken, data.refreshToken)
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
    },
    false
  )
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
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
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
