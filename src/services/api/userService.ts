/**
 * User service
 * Business logic layer for user operations
 */

import { mockUsersApi } from '@/services/mock/mockApi'
import type { User, UserFilters, UserFormData, PaginationParams, ApiResponse, PaginationResponse } from '@/lib/types'

export interface UserListResponse {
  users: User[]
  pagination: PaginationResponse
}

/**
 * Get all users with filters and pagination
 */
export async function getAllUsers(filters?: UserFilters & PaginationParams): Promise<ApiResponse<UserListResponse>> {
  try {
    const response = await mockUsersApi.getAll({
      role: filters?.role,
      organizationId: filters?.organizationId,
      search: filters?.search,
      page: filters?.page,
      limit: filters?.limit,
    })

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Erreur lors de la récupération des utilisateurs',
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
 * Get user by ID
 */
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  try {
    const response = await mockUsersApi.getById(id)
    return response
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      statusCode: 500,
    }
  }
}

