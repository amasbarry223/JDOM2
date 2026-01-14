/**
 * Organizations hook
 * Provides organization state and actions
 */

import { useEffect, useCallback } from 'react'
import { useOrganizationStore } from '@/store/organizationStore'
import { getAllOrganizations } from '@/services/api/organizationService'
import type { OrganizationFormData, PaginationParams } from '@/lib/types'

/**
 * Organizations hook
 * @param options - Options for organization fetching
 * @returns Organization state and actions
 */
export function useOrganizations(options: { autoFetch?: boolean; filters?: { search?: string } & PaginationParams } = {}) {
  const { autoFetch = false, filters } = options

  const {
    organizations,
    pagination,
    selectedOrganization,
    isLoading,
    error,
    setOrganizations,
    setSelectedOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    setLoading,
    setError,
    clearError,
  } = useOrganizationStore()

  const fetchOrganizations = useCallback(async (fetchFilters?: { search?: string } & PaginationParams) => {
    setLoading(true)
    clearError()

    try {
      const response = await getAllOrganizations(fetchFilters || filters)
      if (response.success && response.data) {
        setOrganizations(response.data.organizations)
      } else {
        setError(response.error || 'Erreur lors de la récupération des organisations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [filters, setLoading, clearError, setOrganizations, setError])

  // Auto-fetch organizations
  useEffect(() => {
    if (autoFetch) {
      fetchOrganizations(filters)
    }
  }, [autoFetch, fetchOrganizations, filters])

  const handleCreate = async (data: OrganizationFormData) => {
    setLoading(true)
    clearError()

    try {
      const newOrganization = await createOrganization(data)
      return { success: true, data: newOrganization }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, data: Partial<OrganizationFormData>) => {
    setLoading(true)
    clearError()

    try {
      const updatedOrganization = await updateOrganization(id, data)
      if (updatedOrganization) {
        return { success: true, data: updatedOrganization }
      } else {
        setError('Organisation non trouvée')
        return { success: false, error: 'Organisation non trouvée' }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    clearError()

    try {
      const success = await deleteOrganization(id)
      if (success) {
        return { success: true }
      } else {
        setError('Organisation non trouvée')
        return { success: false, error: 'Organisation non trouvée' }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    organizations,
    pagination,
    selectedOrganization,
    isLoading,
    error,
    fetchOrganizations,
    createOrganization: handleCreate,
    updateOrganization: handleUpdate,
    deleteOrganization: handleDelete,
    setSelectedOrganization,
    clearError,
  }
}

