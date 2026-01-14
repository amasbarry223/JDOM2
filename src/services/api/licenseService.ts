/**
 * License service
 * Business logic layer for license operations
 */

import { mockLicensesApi } from '@/services/mock/mockApi'
import type { License, PaginationParams, ApiResponse, PaginationResponse } from '@/lib/types'

export interface LicenseListResponse {
  licenses: License[]
  pagination: PaginationResponse
}

/**
 * Get all licenses with filters and pagination
 */
export async function getAllLicenses(filters?: { search?: string } & PaginationParams): Promise<ApiResponse<LicenseListResponse>> {
  try {
    const response = await mockLicensesApi.getAll({
      search: filters?.search,
      page: filters?.page,
      limit: filters?.limit,
    })

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Erreur lors de la récupération des licences',
        statusCode: response.statusCode,
      }
    }

    return response
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      statusCode: 500,
    }
  }
}

/**
 * Get license by ID
 */
export async function getLicenseById(id: string): Promise<ApiResponse<License>> {
  try {
    const response = await mockLicensesApi.getById(id)
    return response
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      statusCode: 500,
    }
  }
}

