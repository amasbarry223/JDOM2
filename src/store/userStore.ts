/**
 * User store
 * Manages user state and operations
 */

import { create } from 'zustand'
import type { User, UserFilters, UserFormData, PaginationResponse } from '@/lib/types'
import { formatDate } from '@/lib/utils/format'
import { generateId } from '@/lib/utils/id'
import { saveMockData } from '@/lib/mock/data'
import { toMockUsers } from '@/lib/types/mock.types'

interface UserStore {
  // State
  users: User[]
  filters: UserFilters
  pagination: PaginationResponse
  selectedUser: User | null
  isLoading: boolean
  error: string | null

  // Actions
  setUsers: (users: User[]) => void
  setFilters: (filters: Partial<UserFilters>) => void
  clearFilters: () => void
  setSelectedUser: (user: User | null) => void
  createUser: (data: UserFormData) => Promise<User>
  updateUser: (id: string, data: Partial<UserFormData>) => Promise<User | null>
  deleteUser: (id: string) => Promise<boolean>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Getters
  getFilteredUsers: () => User[]
}

const initialPagination: PaginationResponse = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
}

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  users: [],
  filters: {},
  pagination: initialPagination,
  selectedUser: null,
  isLoading: false,
  error: null,

  // Set users
  setUsers: (users: User[]) => {
    set({ users })
    // Sync with localStorage
    if (typeof window !== 'undefined') {
      saveMockData({ users: toMockUsers(users) })
    }
  },

  // Set filters
  setFilters: (filters: Partial<UserFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },

  // Clear filters
  clearFilters: () => {
    set({ filters: {} })
  },

  // Set selected user
  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user })
  },

  // Create user
  createUser: async (data: UserFormData): Promise<User> => {
    const now = new Date().toISOString()
    const newUser: User = {
      id: generateId(),
      email: data.email.toLowerCase(),
      name: data.name,
      role: data.role,
      organizationId: data.organizationId || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      emailVerified: false,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    }

    set((state) => {
      const updatedUsers = [newUser, ...state.users]
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ users: toMockUsers(updatedUsers) })
      }
      return { users: updatedUsers }
    })

    return newUser
  },

  // Update user
  updateUser: async (id: string, data: Partial<UserFormData>): Promise<User | null> => {
    const state = get()
    const user = state.users.find((u) => u.id === id)
    if (!user) return null

    const updatedUser: User = {
      ...user,
      ...data,
      email: data.email ? data.email.toLowerCase() : user.email,
      updatedAt: new Date().toISOString(),
    } as User

    set((state) => {
      const updatedUsers = state.users.map((u) => (u.id === id ? updatedUser : u))
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ users: toMockUsers(updatedUsers) })
      }
      return {
        users: updatedUsers,
        selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
      }
    })

    return updatedUser
  },

  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    const state = get()
    const user = state.users.find((u) => u.id === id)
    if (!user) return false

    set((state) => {
      const updatedUsers = state.users.filter((u) => u.id !== id)
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ users: toMockUsers(updatedUsers) })
      }
      return {
        users: updatedUsers,
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
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

  // Get filtered users
  getFilteredUsers: (): User[] => {
    const state = get()
    let filtered = [...state.users]

    if (state.filters.role) {
      filtered = filtered.filter((u) => u.role === state.filters.role)
    }
    if (state.filters.organizationId) {
      filtered = filtered.filter((u) => u.organizationId === state.filters.organizationId)
    }
    if (state.filters.isActive !== undefined) {
      filtered = filtered.filter((u) => u.isActive === state.filters.isActive)
    }
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.email.toLowerCase().includes(search) ||
          (u.name && u.name.toLowerCase().includes(search))
      )
    }

    return filtered
  },
}))

