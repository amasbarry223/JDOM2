/**
 * Users hook
 * Provides user state and actions
 */

import { useEffect, useCallback } from 'react'
import { useUserStore } from '@/store/userStore'
import { getAllUsers } from '@/services/api/userService'
import type { UserFilters, UserFormData, PaginationParams } from '@/lib/types'

/**
 * Users hook
 * @param options - Options for user fetching
 * @returns User state and actions
 */
export function useUsers(options: { autoFetch?: boolean; filters?: UserFilters & PaginationParams } = {}) {
  const { autoFetch = false, filters } = options

  const {
    users,
    filters: storeFilters,
    pagination,
    selectedUser,
    isLoading,
    error,
    setUsers,
    setFilters,
    clearFilters,
    setSelectedUser,
    createUser,
    updateUser,
    deleteUser,
    setLoading,
    setError,
    clearError,
    getFilteredUsers,
  } = useUserStore()

  const fetchUsers = useCallback(async (fetchFilters?: UserFilters & PaginationParams) => {
    setLoading(true)
    clearError()

    try {
      const response = await getAllUsers(fetchFilters || storeFilters)
      if (response.success && response.data) {
        setUsers(response.data.users)
      } else {
        setError(response.error || 'Erreur lors de la récupération des utilisateurs')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [storeFilters, setLoading, clearError, setUsers, setError])

  // Auto-fetch users
  useEffect(() => {
    if (autoFetch) {
      fetchUsers(filters)
    }
  }, [autoFetch, fetchUsers, filters])

  // Apply filters when they change
  useEffect(() => {
    if (filters) {
      setFilters(filters)
    }
  }, [filters, setFilters])

  const handleCreate = async (data: UserFormData) => {
    setLoading(true)
    clearError()

    try {
      const newUser = await createUser(data)
      return { success: true, data: newUser }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, data: Partial<UserFormData>) => {
    setLoading(true)
    clearError()

    try {
      const updatedUser = await updateUser(id, data)
      if (updatedUser) {
        return { success: true, data: updatedUser }
      } else {
        setError('Utilisateur non trouvé')
        return { success: false, error: 'Utilisateur non trouvé' }
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
      const success = await deleteUser(id)
      if (success) {
        return { success: true }
      } else {
        setError('Utilisateur non trouvé')
        return { success: false, error: 'Utilisateur non trouvé' }
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
    users,
    filteredUsers: getFilteredUsers(),
    filters: storeFilters,
    pagination,
    selectedUser,
    isLoading,
    error,
    fetchUsers,
    createUser: handleCreate,
    updateUser: handleUpdate,
    deleteUser: handleDelete,
    setFilters,
    clearFilters,
    setSelectedUser,
    clearError,
  }
}

