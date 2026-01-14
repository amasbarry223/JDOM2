/**
 * Authentication-related types
 */

import type { User } from './user.types'

/**
 * Session data
 */
export interface Session {
  readonly userId: string
  readonly email: string
  readonly expiresAt: string
}

/**
 * Authentication response
 */
export interface AuthResponse {
  success: boolean
  user?: Omit<User, 'password'>
  error?: string
  message?: string
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

