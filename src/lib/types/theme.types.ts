/**
 * Theme-related types
 */

import type { BaseEntity } from './common.types'

/**
 * Theme entity
 */
export interface Theme extends BaseEntity {
  readonly name: string
  readonly slug: string
  readonly description: string | null
  readonly icon: string | null
}

/**
 * Theme form data (for create/update)
 */
export interface ThemeFormData {
  name: string
  slug: string
  description?: string
  icon?: string
}

