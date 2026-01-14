/**
 * Authentication store
 * Manages user authentication state
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session, AuthState } from '@/lib/types'
import { mockLogin, mockLogout, getMockUser, getMockSession } from '@/lib/mock/auth'

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkSession: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const result = await mockLogin(email, password)
          if (result.success && result.user) {
            const session = getMockSession()
            set({
              user: result.user as User,
              session: session as Session | null,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return { success: true }
          } else {
            set({
              isLoading: false,
              error: result.error || 'Erreur de connexion',
            })
            return { success: false, error: result.error }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion'
          set({
            isLoading: false,
            error: errorMessage,
          })
          return { success: false, error: errorMessage }
        }
      },

      // Logout action
      logout: () => {
        mockLogout()
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        })
      },

      // Check session action
      checkSession: async () => {
        set({ isLoading: true })
        try {
          const user = getMockUser()
          const session = getMockSession()
          if (user && session) {
            set({
              user: user as User,
              session: session as Session,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            })
          }
        } catch (error) {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      // Update user action
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates } as User,
          })
        }
      },

      // Clear error action
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

