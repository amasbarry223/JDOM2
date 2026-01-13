/**
 * Application-wide constants
 */

export const ROLES = {
  ADMIN: 'admin',
  CONTRIBUTOR: 'contributor',
  PUBLIC: 'public',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

export const ALLOWED_ROLES: UserRole[] = [ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.PUBLIC]

export const DATASET_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export type DatasetStatus = typeof DATASET_STATUS[keyof typeof DATASET_STATUS]

export const SESSION_DURATION_HOURS = 24
export const PASSWORD_MIN_LENGTH = 8
export const BCRYPT_SALT_ROUNDS = 10

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

