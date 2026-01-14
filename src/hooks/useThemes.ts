/**
 * Themes hook
 * Provides theme state and actions
 */

import { useEffect, useCallback } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { getAllThemes } from '@/services/api/themeService'
import type { ThemeFormData, PaginationParams } from '@/lib/types'

/**
 * Themes hook
 * @param options - Options for theme fetching
 * @returns Theme state and actions
 */
export function useThemes(options: { autoFetch?: boolean; filters?: { search?: string } & PaginationParams } = {}) {
  const { autoFetch = false, filters } = options

  const {
    themes,
    pagination,
    selectedTheme,
    isLoading,
    error,
    setThemes,
    setSelectedTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    setLoading,
    setError,
    clearError,
  } = useThemeStore()

  const fetchThemes = useCallback(async (fetchFilters?: { search?: string } & PaginationParams) => {
    setLoading(true)
    clearError()

    try {
      const response = await getAllThemes(fetchFilters || filters)
      if (response.success && response.data) {
        setThemes(response.data.themes)
      } else {
        setError(response.error || 'Erreur lors de la récupération des thèmes')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [filters, setLoading, clearError, setThemes, setError])

  // Auto-fetch themes
  useEffect(() => {
    if (autoFetch) {
      fetchThemes(filters)
    }
  }, [autoFetch, fetchThemes, filters])

  const handleCreate = async (data: ThemeFormData) => {
    setLoading(true)
    clearError()

    try {
      const newTheme = await createTheme(data)
      return { success: true, data: newTheme }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, data: Partial<ThemeFormData>) => {
    setLoading(true)
    clearError()

    try {
      const updatedTheme = await updateTheme(id, data)
      if (updatedTheme) {
        return { success: true, data: updatedTheme }
      } else {
        setError('Thème non trouvé')
        return { success: false, error: 'Thème non trouvé' }
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
      const success = await deleteTheme(id)
      if (success) {
        return { success: true }
      } else {
        setError('Thème non trouvé')
        return { success: false, error: 'Thème non trouvé' }
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
    themes,
    pagination,
    selectedTheme,
    isLoading,
    error,
    fetchThemes,
    createTheme: handleCreate,
    updateTheme: handleUpdate,
    deleteTheme: handleDelete,
    setSelectedTheme,
    clearError,
  }
}

