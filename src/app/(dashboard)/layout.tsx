/**
 * Dashboard Layout
 * Layout wrapper for all dashboard pages
 */

'use client'

import { DashboardLayout as Layout } from '@/components/layout/DashboardLayout'
import { useInitializeStores } from '@/hooks/useInitializeStores'

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize all stores once at the layout level
  useInitializeStores()

  return <Layout>{children}</Layout>
}

