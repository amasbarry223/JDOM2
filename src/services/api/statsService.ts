/**
 * Stats service
 * Business logic layer for statistics operations
 */

import { mockStatsApi } from '@/services/mock/mockApi'
import type { ApiResponse } from '@/lib/types'

export interface StatsResponse {
  overview: {
    totalDatasets: number
    publishedDatasets: number
    draftDatasets: number
    archivedDatasets: number
    totalDownloads: number
    totalViews: number
    totalUsers: number
    activeUsers: number
    totalOrganizations: number
    totalThemes: number
    totalLicenses: number
    featuredDatasets: number
  }
  datasetsByTheme: Array<{ id: string; name: string; slug: string; datasetsCount: number }>
  datasetsByOrganization: Array<{ id: string; name: string; datasetsCount: number }>
  recentDatasets: unknown[]
  topDatasets: unknown[]
}

/**
 * Get platform statistics
 */
export async function getStats(): Promise<ApiResponse<StatsResponse>> {
  try {
    const response = await mockStatsApi.getStats()
    return response
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      statusCode: 500,
    }
  }
}

