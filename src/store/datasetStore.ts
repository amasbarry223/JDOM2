/**
 * Dataset store
 * Manages dataset state and operations
 */

import { create } from 'zustand'
import type { Dataset, DatasetFilters, DatasetFormData, PaginationParams, PaginationResponse } from '@/lib/types'
import { formatDate } from '@/lib/utils/format'
import { generateId } from '@/lib/utils/id'
import { saveMockData } from '@/lib/mock/data'

interface DatasetStore {
  // State
  datasets: Dataset[]
  filters: DatasetFilters
  pagination: PaginationResponse
  selectedDataset: Dataset | null
  isLoading: boolean
  error: string | null

  // Actions
  setDatasets: (datasets: Dataset[]) => void
  setFilters: (filters: Partial<DatasetFilters>) => void
  clearFilters: () => void
  setSelectedDataset: (dataset: Dataset | null) => void
  createDataset: (data: DatasetFormData) => Promise<Dataset>
  updateDataset: (id: string, data: Partial<DatasetFormData>) => Promise<Dataset | null>
  deleteDataset: (id: string) => Promise<boolean>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Getters (computed)
  getFilteredDatasets: () => Dataset[]
  getPublishedDatasets: () => Dataset[]
  getDraftDatasets: () => Dataset[]
  getFeaturedDatasets: () => Dataset[]
}

const initialPagination: PaginationResponse = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
}

export const useDatasetStore = create<DatasetStore>((set, get) => ({
  // Initial state
  datasets: [],
  filters: {},
  pagination: initialPagination,
  selectedDataset: null,
  isLoading: false,
  error: null,

  // Set datasets
  setDatasets: (datasets: Dataset[]) => {
    set({ datasets })
    // Sync with localStorage
    if (typeof window !== 'undefined') {
      saveMockData({ datasets })
    }
  },

  // Set filters
  setFilters: (filters: Partial<DatasetFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },

  // Clear filters
  clearFilters: () => {
    set({ filters: {} })
  },

  // Set selected dataset
  setSelectedDataset: (dataset: Dataset | null) => {
    set({ selectedDataset: dataset })
  },

  // Create dataset
  createDataset: async (data: DatasetFormData): Promise<Dataset> => {
    const now = new Date().toISOString()
    const newDataset: Dataset = {
      id: generateId(),
      title: data.title,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      format: data.format,
      downloadUrl: null,
      apiUrl: null,
      spatialCoverage: data.spatialCoverage || null,
      temporalCoverage: data.temporalCoverage || null,
      publicationDate: formatDate(),
      updateFrequency: data.updateFrequency || null,
      lastUpdated: now,
      fileSize: null,
      recordCount: null,
      downloadsCount: 0,
      viewsCount: 0,
      featured: data.featured || false,
      status: data.status || 'draft',
      currentVersion: 1,
      producerId: data.producerId,
      themeId: data.themeId || null,
      licenseId: data.licenseId,
      createdById: null,
      createdAt: now,
      updatedAt: now,
    }

    set((state) => {
      const updatedDatasets = [newDataset, ...state.datasets]
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ datasets: updatedDatasets })
      }
      return { datasets: updatedDatasets }
    })

    return newDataset
  },

  // Update dataset
  updateDataset: async (id: string, data: Partial<DatasetFormData>): Promise<Dataset | null> => {
    const state = get()
    const dataset = state.datasets.find((d) => d.id === id)
    if (!dataset) return null

    const updatedDataset: Dataset = {
      ...dataset,
      ...data,
      updatedAt: new Date().toISOString(),
    } as Dataset

    set((state) => {
      const updatedDatasets = state.datasets.map((d) => (d.id === id ? updatedDataset : d))
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ datasets: updatedDatasets })
      }
      return {
        datasets: updatedDatasets,
        selectedDataset: state.selectedDataset?.id === id ? updatedDataset : state.selectedDataset,
      }
    })

    return updatedDataset
  },

  // Delete dataset
  deleteDataset: async (id: string): Promise<boolean> => {
    const state = get()
    const dataset = state.datasets.find((d) => d.id === id)
    if (!dataset) return false

    set((state) => {
      const updatedDatasets = state.datasets.filter((d) => d.id !== id)
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ datasets: updatedDatasets })
      }
      return {
        datasets: updatedDatasets,
        selectedDataset: state.selectedDataset?.id === id ? null : state.selectedDataset,
      }
    })

    return true
  },

  // Set loading
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  // Set error
  setError: (error: string | null) => {
    set({ error })
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  // Get filtered datasets (optimized with early returns)
  getFilteredDatasets: (): Dataset[] => {
    const state = get()
    const { datasets, filters } = state
    
    // Early return if no filters
    if (!filters || Object.keys(filters).length === 0) {
      return datasets
    }

    let filtered = datasets

    // Apply filters in order of selectivity (most selective first)
    if (filters.status) {
      filtered = filtered.filter((d) => d.status === filters.status)
    }
    if (filters.producerId) {
      filtered = filtered.filter((d) => d.producerId === filters.producerId)
    }
    if (filters.themeId) {
      filtered = filtered.filter((d) => d.themeId === filters.themeId)
    }
    if (filters.format) {
      filtered = filtered.filter((d) => d.format === filters.format)
    }
    if (filters.featured !== undefined) {
      filtered = filtered.filter((d) => d.featured === filters.featured)
    }
    // Search is last as it's the most expensive operation
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(search) ||
          (d.shortDescription && d.shortDescription.toLowerCase().includes(search))
      )
    }

    return filtered
  },

  // Get published datasets
  getPublishedDatasets: (): Dataset[] => {
    return get().datasets.filter((d) => d.status === 'published')
  },

  // Get draft datasets
  getDraftDatasets: (): Dataset[] => {
    return get().datasets.filter((d) => d.status === 'draft')
  },

  // Get featured datasets
  getFeaturedDatasets: (): Dataset[] => {
    return get().datasets.filter((d) => d.featured)
  },
}))

