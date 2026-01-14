/**
 * Common types used across the application
 */

/**
 * Base entity interface with common fields
 */
export interface BaseEntity {
  readonly id: string
  readonly createdAt: string
  readonly updatedAt: string
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

/**
 * Pagination response metadata
 */
export interface PaginationResponse {
  page: number
  limit: number
  total: number
  pages: number
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  statusCode?: number
  pagination?: PaginationResponse
}

/**
 * API error structure
 */
export interface ApiError {
  message: string
  code?: string
  statusCode: number
  details?: Record<string, unknown>
}

