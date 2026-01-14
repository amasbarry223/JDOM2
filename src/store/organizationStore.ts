/**
 * Organization store
 * Manages organization state and operations
 */

import { create } from 'zustand'
import type { Organization, OrganizationFormData, PaginationResponse } from '@/lib/types'
import { generateId } from '@/lib/utils/id'
import { saveMockData } from '@/lib/mock/data'

interface OrganizationStore {
  // State
  organizations: Organization[]
  pagination: PaginationResponse
  selectedOrganization: Organization | null
  isLoading: boolean
  error: string | null

  // Actions
  setOrganizations: (organizations: Organization[]) => void
  setSelectedOrganization: (organization: Organization | null) => void
  createOrganization: (data: OrganizationFormData) => Promise<Organization>
  updateOrganization: (id: string, data: Partial<OrganizationFormData>) => Promise<Organization | null>
  deleteOrganization: (id: string) => Promise<boolean>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

const initialPagination: PaginationResponse = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
}

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  // Initial state
  organizations: [],
  pagination: initialPagination,
  selectedOrganization: null,
  isLoading: false,
  error: null,

  // Set organizations
  setOrganizations: (organizations: Organization[]) => {
    set({ organizations })
    // Sync with localStorage
    if (typeof window !== 'undefined') {
      saveMockData({ organizations })
    }
  },

  // Set selected organization
  setSelectedOrganization: (organization: Organization | null) => {
    set({ selectedOrganization: organization })
  },

  // Create organization
  createOrganization: async (data: OrganizationFormData): Promise<Organization> => {
    const now = new Date().toISOString()
    const newOrganization: Organization = {
      id: generateId(),
      name: data.name,
      description: data.description || null,
      email: data.email || null,
      website: data.website || null,
      logo: data.logo || null,
      createdAt: now,
      updatedAt: now,
    }

    set((state) => {
      const updatedOrganizations = [newOrganization, ...state.organizations]
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ organizations: updatedOrganizations })
      }
      return { organizations: updatedOrganizations }
    })

    return newOrganization
  },

  // Update organization
  updateOrganization: async (id: string, data: Partial<OrganizationFormData>): Promise<Organization | null> => {
    const state = get()
    const organization = state.organizations.find((o) => o.id === id)
    if (!organization) return null

    const updatedOrganization: Organization = {
      ...organization,
      ...data,
      updatedAt: new Date().toISOString(),
    } as Organization

    set((state) => {
      const updatedOrganizations = state.organizations.map((o) => (o.id === id ? updatedOrganization : o))
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ organizations: updatedOrganizations })
      }
      return {
        organizations: updatedOrganizations,
        selectedOrganization: state.selectedOrganization?.id === id ? updatedOrganization : state.selectedOrganization,
      }
    })

    return updatedOrganization
  },

  // Delete organization
  deleteOrganization: async (id: string): Promise<boolean> => {
    const state = get()
    const organization = state.organizations.find((o) => o.id === id)
    if (!organization) return false

    set((state) => {
      const updatedOrganizations = state.organizations.filter((o) => o.id !== id)
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ organizations: updatedOrganizations })
      }
      return {
        organizations: updatedOrganizations,
        selectedOrganization: state.selectedOrganization?.id === id ? null : state.selectedOrganization,
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

