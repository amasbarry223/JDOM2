/**
 * Dashboard Layout component
 * Main layout wrapper for dashboard pages
 */

'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

