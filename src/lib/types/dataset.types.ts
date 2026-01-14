/**
 * Dataset-related types
 */

import type { BaseEntity } from './common.types'

/**
 * Dataset status values
 */
export type DatasetStatus = 'draft' | 'published' | 'archived'

/**
 * Dataset format types
 */
export type DatasetFormat = 'CSV' | 'JSON' | 'XML' | 'XLSX' | 'API'

/**
 * Dataset entity
 */
export interface Dataset extends BaseEntity {
  readonly title: string
  readonly slug: string
  readonly shortDescription: string | null
  readonly description: string | null
  readonly format: DatasetFormat
  readonly downloadUrl: string | null
  readonly apiUrl: string | null
  readonly spatialCoverage: string | null
  readonly temporalCoverage: string | null
  readonly publicationDate: string
  readonly updateFrequency: string | null
  readonly lastUpdated: string
  readonly fileSize: number | null
  readonly recordCount: number | null
  readonly downloadsCount: number
  readonly viewsCount: number
  readonly featured: boolean
  readonly status: DatasetStatus
  readonly currentVersion: number
  readonly producerId: string
  readonly themeId: string | null
  readonly licenseId: string
  readonly createdById: string | null
}

/**
 * Dataset filters for queries
 */
export interface DatasetFilters {
  status?: DatasetStatus
  themeId?: string
  producerId?: string
  search?: string
  featured?: boolean
  format?: DatasetFormat
}

/**
 * Dataset form data (for create/update)
 */
export interface DatasetFormData {
  title: string
  shortDescription?: string
  description?: string
  format: DatasetFormat
  status?: DatasetStatus
  producerId: string
  themeId?: string
  licenseId: string
  updateFrequency?: string
  featured?: boolean
  spatialCoverage?: string
  temporalCoverage?: string
}

