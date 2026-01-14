/**
 * User-related types
 */

import type { BaseEntity } from './common.types'

/**
 * User role values
 */
export type UserRole = 'admin' | 'contributor' | 'public'

/**
 * User entity
 */
export interface User extends BaseEntity {
  readonly email: string
  readonly name: string | null
  readonly role: UserRole
  readonly organizationId: string | null
  readonly isActive: boolean
  readonly emailVerified: boolean | null
  readonly lastLoginAt: string | null
}

/**
 * User filters for queries
 */
export interface UserFilters {
  role?: UserRole
  organizationId?: string
  search?: string
  isActive?: boolean
}

/**
 * User form data (for create/update)
 */
export interface UserFormData {
  name: string
  email: string
  role: UserRole
  organizationId?: string
  isActive?: boolean
}

