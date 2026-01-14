/**
 * Initialize Stores Hook
 * Centralizes store initialization to avoid duplication across pages
 */

import { useEffect, useRef } from 'react'
import { loadMockData } from '@/lib/mock/data'
import { toAppUsers } from '@/lib/types/mock.types'
import { useDatasetStore } from '@/store/datasetStore'
import { useUserStore } from '@/store/userStore'
import { useOrganizationStore } from '@/store/organizationStore'
import { useThemeStore } from '@/store/themeStore'
import { useLicenseStore } from '@/store/licenseStore'
import type { Dataset, Organization, Theme, License } from '@/lib/types'

/**
 * Hook to initialize all stores with mock data
 * Ensures stores are initialized only once, even if hook is called multiple times
 */
export function useInitializeStores() {
  const initializedRef = useRef(false)

  useEffect(() => {
    // Prevent multiple initializations
    if (initializedRef.current) return

    // Check if stores already have data (from localStorage persistence)
    const datasetStore = useDatasetStore.getState()
    const userStore = useUserStore.getState()
    const organizationStore = useOrganizationStore.getState()
    const themeStore = useThemeStore.getState()
    const licenseStore = useLicenseStore.getState()

    // Only initialize if stores are empty
    const needsInitialization =
      datasetStore.datasets.length === 0 ||
      userStore.users.length === 0 ||
      organizationStore.organizations.length === 0 ||
      themeStore.themes.length === 0 ||
      licenseStore.licenses.length === 0

    if (needsInitialization) {
      const data = loadMockData()

      // Initialize stores with mock data
      datasetStore.setDatasets(data.datasets as Dataset[])
      userStore.setUsers(toAppUsers(data.users))
      organizationStore.setOrganizations(data.organizations as Organization[])
      themeStore.setThemes(data.themes as Theme[])
      licenseStore.setLicenses(data.licenses as License[])
    }

    initializedRef.current = true
  }, [])
}

