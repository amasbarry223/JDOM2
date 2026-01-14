/**
 * Home Page
 * Redirects to dashboard or shows public view
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import DashboardPage from '@/app/(dashboard)/page'

export default function HomePage() {
  const router = useRouter()

  // For now, just show the dashboard
  // In the future, this could show a public landing page
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  )
}
