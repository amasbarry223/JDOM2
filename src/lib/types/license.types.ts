/**
 * License-related types
 */

import type { BaseEntity } from './common.types'

/**
 * License entity
 */
export interface License extends BaseEntity {
  readonly name: string
  readonly slug: string
  readonly description: string | null
  readonly url: string | null
}

/**
 * License form data (for create/update)
 */
export interface LicenseFormData {
  name: string
  slug: string
  description?: string
  url?: string
}

