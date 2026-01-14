/**
 * Organization-related types
 */

import type { BaseEntity } from './common.types'

/**
 * Organization entity
 */
export interface Organization extends BaseEntity {
  readonly name: string
  readonly description: string | null
  readonly email: string | null
  readonly website: string | null
  readonly logo: string | null
}

/**
 * Organization form data (for create/update)
 */
export interface OrganizationFormData {
  name: string
  description?: string
  email?: string
  website?: string
  logo?: string
}

