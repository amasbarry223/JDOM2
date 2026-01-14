/**
 * License store
 * Manages license state and operations
 */

import { create } from 'zustand'
import type { License, LicenseFormData, PaginationResponse } from '@/lib/types'
import { generateId } from '@/lib/utils/id'
import { generateSlug } from '@/lib/utils/validation'
import { saveMockData } from '@/lib/mock/data'

interface LicenseStore {
  // State
  licenses: License[]
  pagination: PaginationResponse
  selectedLicense: License | null
  isLoading: boolean
  error: string | null

  // Actions
  setLicenses: (licenses: License[]) => void
  setSelectedLicense: (license: License | null) => void
  createLicense: (data: LicenseFormData) => Promise<License>
  updateLicense: (id: string, data: Partial<LicenseFormData>) => Promise<License | null>
  deleteLicense: (id: string) => Promise<boolean>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

const initialPagination: PaginationResponse = {
  page: 1,
  limit: 100,
  total: 0,
  pages: 0,
}

export const useLicenseStore = create<LicenseStore>((set, get) => ({
  // Initial state
  licenses: [],
  pagination: initialPagination,
  selectedLicense: null,
  isLoading: false,
  error: null,

  // Set licenses
  setLicenses: (licenses: License[]) => {
    set({ licenses })
    // Sync with localStorage
    if (typeof window !== 'undefined') {
      saveMockData({ licenses })
    }
  },

  // Set selected license
  setSelectedLicense: (license: License | null) => {
    set({ selectedLicense: license })
  },

  // Create license
  createLicense: async (data: LicenseFormData): Promise<License> => {
    const now = new Date().toISOString()
    const slug = data.slug || generateSlug(data.name)
    const newLicense: License = {
      id: generateId(),
      name: data.name,
      slug,
      description: data.description || null,
      url: data.url || null,
      createdAt: now,
      updatedAt: now,
    }

    set((state) => {
      const updatedLicenses = [newLicense, ...state.licenses]
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ licenses: updatedLicenses })
      }
      return { licenses: updatedLicenses }
    })

    return newLicense
  },

  // Update license
  updateLicense: async (id: string, data: Partial<LicenseFormData>): Promise<License | null> => {
    const state = get()
    const license = state.licenses.find((l) => l.id === id)
    if (!license) return null

    const slug = data.slug || (data.name ? generateSlug(data.name) : license.slug)
    const updatedLicense: License = {
      ...license,
      ...data,
      slug,
      updatedAt: new Date().toISOString(),
    } as License

    set((state) => {
      const updatedLicenses = state.licenses.map((l) => (l.id === id ? updatedLicense : l))
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ licenses: updatedLicenses })
      }
      return {
        licenses: updatedLicenses,
        selectedLicense: state.selectedLicense?.id === id ? updatedLicense : state.selectedLicense,
      }
    })

    return updatedLicense
  },

  // Delete license
  deleteLicense: async (id: string): Promise<boolean> => {
    const state = get()
    const license = state.licenses.find((l) => l.id === id)
    if (!license) return false

    set((state) => {
      const updatedLicenses = state.licenses.filter((l) => l.id !== id)
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ licenses: updatedLicenses })
      }
      return {
        licenses: updatedLicenses,
        selectedLicense: state.selectedLicense?.id === id ? null : state.selectedLicense,
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
}))

