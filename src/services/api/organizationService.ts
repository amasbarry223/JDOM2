/**
 * Organization service
 * Business logic layer for organization operations
 */

import { mockOrganizationsApi } from '@/services/mock/mockApi'
import type { Organization, PaginationParams, ApiResponse, PaginationResponse } from '@/lib/types'

export interface OrganizationListResponse {
  organizations: Organization[]
  pagination: PaginationResponse
}

/**
 * Get all organizations with filters and pagination
 */
export async function getAllOrganizations(
  filters?: { search?: string } & PaginationParams
): Promise<ApiResponse<OrganizationListResponse>> {
  try {
    const response = await mockOrganizationsApi.getAll({
      search: filters?.search,
      page: filters?.page,
      limit: filters?.limit,
    })

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Erreur lors de la récupération des organisations',
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
 * Get organization by ID
 */
export async function getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
  try {
    const response = await mockOrganizationsApi.getById(id)
    return response
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      statusCode: 500,
    }
  }
}

