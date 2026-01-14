/**
 * Licenses hook
 * Provides license state and actions
 */

import { useEffect, useCallback } from 'react'
import { useLicenseStore } from '@/store/licenseStore'
import { getAllLicenses } from '@/services/api/licenseService'
import type { LicenseFormData, PaginationParams } from '@/lib/types'

/**
 * Licenses hook
 * @param options - Options for license fetching
 * @returns License state and actions
 */
export function useLicenses(options: { autoFetch?: boolean; filters?: { search?: string } & PaginationParams } = {}) {
  const { autoFetch = false, filters } = options

  const {
    licenses,
    pagination,
    selectedLicense,
    isLoading,
    error,
    setLicenses,
    setSelectedLicense,
    createLicense,
    updateLicense,
    deleteLicense,
    setLoading,
    setError,
    clearError,
  } = useLicenseStore()

  const fetchLicenses = useCallback(async (fetchFilters?: { search?: string } & PaginationParams) => {
    setLoading(true)
    clearError()

    try {
      const response = await getAllLicenses(fetchFilters || filters)
      if (response.success && response.data) {
        setLicenses(response.data.licenses)
      } else {
        setError(response.error || 'Erreur lors de la récupération des licences')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [filters, setLoading, clearError, setLicenses, setError])

  // Auto-fetch licenses
  useEffect(() => {
    if (autoFetch) {
      fetchLicenses(filters)
    }
  }, [autoFetch, fetchLicenses, filters])

  const handleCreate = async (data: LicenseFormData) => {
    setLoading(true)
    clearError()

    try {
      const newLicense = await createLicense(data)
      return { success: true, data: newLicense }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, data: Partial<LicenseFormData>) => {
    setLoading(true)
    clearError()

    try {
      const updatedLicense = await updateLicense(id, data)
      if (updatedLicense) {
        return { success: true, data: updatedLicense }
      } else {
        setError('Licence non trouvée')
        return { success: false, error: 'Licence non trouvée' }
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
      const success = await deleteLicense(id)
      if (success) {
        return { success: true }
      } else {
        setError('Licence non trouvée')
        return { success: false, error: 'Licence non trouvée' }
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
    licenses,
    pagination,
    selectedLicense,
    isLoading,
    error,
    fetchLicenses,
    createLicense: handleCreate,
    updateLicense: handleUpdate,
    deleteLicense: handleDelete,
    setSelectedLicense,
    clearError,
  }
}

