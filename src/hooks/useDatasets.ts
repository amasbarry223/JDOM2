/**
 * Datasets hook
 * Provides dataset state and actions
 */

import { useEffect, useCallback } from 'react'
import { useDatasetStore } from '@/store/datasetStore'
import { getAllDatasets } from '@/services/api/datasetService'
import type { DatasetFilters, DatasetFormData, PaginationParams, Dataset } from '@/lib/types'
import { logger } from '@/lib/utils/logger'

/**
 * Datasets hook
 * @param options - Options for dataset fetching
 * @returns Dataset state and actions
 */
export function useDatasets(options: { autoFetch?: boolean; filters?: DatasetFilters & PaginationParams } = {}) {
  const { autoFetch = false, filters } = options

  const {
    datasets,
    filters: storeFilters,
    pagination,
    selectedDataset,
    isLoading,
    error,
    setDatasets,
    setFilters,
    clearFilters,
    setSelectedDataset,
    createDataset,
    updateDataset,
    deleteDataset,
    setLoading,
    setError,
    clearError,
    getFilteredDatasets,
    getPublishedDatasets,
    getDraftDatasets,
    getFeaturedDatasets,
  } = useDatasetStore()

  const fetchDatasets = useCallback(async (fetchFilters?: DatasetFilters & PaginationParams) => {
    setLoading(true)
    clearError()

    try {
      const response = await getAllDatasets(fetchFilters || storeFilters)
      if (response.success && response.data) {
        setDatasets(response.data.datasets as Dataset[])
      } else {
        const errorMessage = response.error || 'Erreur lors de la récupération des datasets'
        setError(errorMessage)
        logger.error('Failed to fetch datasets', new Error(errorMessage))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      logger.error('Error fetching datasets', err)
    } finally {
      setLoading(false)
    }
  }, [storeFilters, setLoading, clearError, setDatasets, setError])

  // Auto-fetch datasets
  useEffect(() => {
    if (autoFetch) {
      fetchDatasets(filters)
    }
  }, [autoFetch, fetchDatasets, filters])

  // Apply filters when they change
  useEffect(() => {
    if (filters) {
      setFilters(filters)
    }
  }, [filters, setFilters])

  const handleCreate = useCallback(async (data: DatasetFormData) => {
    setLoading(true)
    clearError()

    try {
      const newDataset = await createDataset(data)
      return { success: true as const, data: newDataset }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création'
      setError(errorMessage)
      logger.error('Failed to create dataset', err)
      return { success: false as const, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [createDataset, setLoading, clearError, setError])

  const handleUpdate = useCallback(async (id: string, data: Partial<DatasetFormData>) => {
    setLoading(true)
    clearError()

    try {
      const updatedDataset = await updateDataset(id, data)
      if (updatedDataset) {
        return { success: true as const, data: updatedDataset }
      } else {
        const errorMessage = 'Dataset non trouvé'
        setError(errorMessage)
        logger.warn('Dataset not found for update', { id })
        return { success: false as const, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      setError(errorMessage)
      logger.error('Failed to update dataset', err)
      return { success: false as const, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [updateDataset, setLoading, clearError, setError])

  const handleDelete = useCallback(async (id: string) => {
    setLoading(true)
    clearError()

    try {
      const success = await deleteDataset(id)
      if (success) {
        return { success: true as const }
      } else {
        const errorMessage = 'Dataset non trouvé'
        setError(errorMessage)
        logger.warn('Dataset not found for deletion', { id })
        return { success: false as const, error: errorMessage }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      setError(errorMessage)
      logger.error('Failed to delete dataset', err)
      return { success: false as const, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [deleteDataset, setLoading, clearError, setError])

  return {
    datasets,
    filteredDatasets: getFilteredDatasets(),
    publishedDatasets: getPublishedDatasets(),
    draftDatasets: getDraftDatasets(),
    featuredDatasets: getFeaturedDatasets(),
    filters: storeFilters,
    pagination,
    selectedDataset,
    isLoading,
    error,
    fetchDatasets,
    createDataset: handleCreate,
    updateDataset: handleUpdate,
    deleteDataset: handleDelete,
    setFilters,
    clearFilters,
    setSelectedDataset,
    clearError,
  }
}

