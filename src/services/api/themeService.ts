/**
 * Theme service
 * Business logic layer for theme operations
 */

import { mockThemesApi } from '@/services/mock/mockApi'
import type { Theme, PaginationParams, ApiResponse, PaginationResponse } from '@/lib/types'

export interface ThemeListResponse {
  themes: Theme[]
  pagination: PaginationResponse
}

/**
 * Get all themes with filters and pagination
 */
export async function getAllThemes(filters?: { search?: string } & PaginationParams): Promise<ApiResponse<ThemeListResponse>> {
  try {
    const response = await mockThemesApi.getAll({
      search: filters?.search,
      page: filters?.page,
      limit: filters?.limit,
    })

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Erreur lors de la récupération des thèmes',
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
 * Get theme by ID
 */
export async function getThemeById(id: string): Promise<ApiResponse<Theme>> {
  try {
    const response = await mockThemesApi.getById(id)
    return response
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      statusCode: 500,
    }
  }
}

