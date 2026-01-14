/**
 * Theme store
 * Manages theme state and operations
 */

import { create } from 'zustand'
import type { Theme, ThemeFormData, PaginationResponse } from '@/lib/types'
import { generateId } from '@/lib/utils/id'
import { generateSlug } from '@/lib/utils/validation'
import { saveMockData } from '@/lib/mock/data'

interface ThemeStore {
  // State
  themes: Theme[]
  pagination: PaginationResponse
  selectedTheme: Theme | null
  isLoading: boolean
  error: string | null

  // Actions
  setThemes: (themes: Theme[]) => void
  setSelectedTheme: (theme: Theme | null) => void
  createTheme: (data: ThemeFormData) => Promise<Theme>
  updateTheme: (id: string, data: Partial<ThemeFormData>) => Promise<Theme | null>
  deleteTheme: (id: string) => Promise<boolean>
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

export const useThemeStore = create<ThemeStore>((set, get) => ({
  // Initial state
  themes: [],
  pagination: initialPagination,
  selectedTheme: null,
  isLoading: false,
  error: null,

  // Set themes
  setThemes: (themes: Theme[]) => {
    set({ themes })
    // Sync with localStorage
    if (typeof window !== 'undefined') {
      saveMockData({ themes })
    }
  },

  // Set selected theme
  setSelectedTheme: (theme: Theme | null) => {
    set({ selectedTheme: theme })
  },

  // Create theme
  createTheme: async (data: ThemeFormData): Promise<Theme> => {
    const now = new Date().toISOString()
    const slug = data.slug || generateSlug(data.name)
    const newTheme: Theme = {
      id: generateId(),
      name: data.name,
      slug,
      description: data.description || null,
      icon: data.icon || null,
      createdAt: now,
      updatedAt: now,
    }

    set((state) => {
      const updatedThemes = [newTheme, ...state.themes]
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ themes: updatedThemes })
      }
      return { themes: updatedThemes }
    })

    return newTheme
  },

  // Update theme
  updateTheme: async (id: string, data: Partial<ThemeFormData>): Promise<Theme | null> => {
    const state = get()
    const theme = state.themes.find((t) => t.id === id)
    if (!theme) return null

    const slug = data.slug || (data.name ? generateSlug(data.name) : theme.slug)
    const updatedTheme: Theme = {
      ...theme,
      ...data,
      slug,
      updatedAt: new Date().toISOString(),
    } as Theme

    set((state) => {
      const updatedThemes = state.themes.map((t) => (t.id === id ? updatedTheme : t))
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ themes: updatedThemes })
      }
      return {
        themes: updatedThemes,
        selectedTheme: state.selectedTheme?.id === id ? updatedTheme : state.selectedTheme,
      }
    })

    return updatedTheme
  },

  // Delete theme
  deleteTheme: async (id: string): Promise<boolean> => {
    const state = get()
    const theme = state.themes.find((t) => t.id === id)
    if (!theme) return false

    set((state) => {
      const updatedThemes = state.themes.filter((t) => t.id !== id)
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        saveMockData({ themes: updatedThemes })
      }
      return {
        themes: updatedThemes,
        selectedTheme: state.selectedTheme?.id === id ? null : state.selectedTheme,
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

