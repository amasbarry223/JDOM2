/**
 * UI store
 * Manages UI state (sidebar, modals, current page, etc.)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ModalState {
  dataset: boolean
  user: boolean
  organization: boolean
  theme: boolean
  license: boolean
}

interface UIStore {
  // State
  sidebarOpen: boolean
  currentPage: string
  modals: ModalState
  searchTerm: string

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setCurrentPage: (page: string) => void
  openModal: (modal: keyof ModalState) => void
  closeModal: (modal: keyof ModalState) => void
  closeAllModals: () => void
  setSearchTerm: (term: string) => void
}

const initialModalState: ModalState = {
  dataset: false,
  user: false,
  organization: false,
  theme: false,
  license: false,
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      currentPage: 'dashboard',
      modals: initialModalState,
      searchTerm: '',

      // Toggle sidebar
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      // Set sidebar open state
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
      },

      // Set current page
      setCurrentPage: (page: string) => {
        set({ currentPage: page })
      },

      // Open modal
      openModal: (modal: keyof ModalState) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [modal]: true,
          },
        }))
      },

      // Close modal
      closeModal: (modal: keyof ModalState) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [modal]: false,
          },
        }))
      },

      // Close all modals
      closeAllModals: () => {
        set({ modals: initialModalState })
      },

      // Set search term
      setSearchTerm: (term: string) => {
        set({ searchTerm: term })
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        currentPage: state.currentPage,
      }),
    }
  )
)

