/**
 * Header component
 * Top header bar for the dashboard
 */

'use client'

import { Menu, X, Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/uiStore'

export function Header() {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

