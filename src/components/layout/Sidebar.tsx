/**
 * Sidebar component
 * Navigation sidebar for the dashboard
 */

'use client'

import { memo, useCallback, useMemo, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Database,
  Users,
  Building2,
  Tag,
  Scale,
  BarChart3,
  Settings,
  LogOut,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/utils/constants'

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: ROUTES.DASHBOARD },
  { id: 'datasets', label: 'Jeux de données', icon: Database, route: ROUTES.DATASETS },
  { id: 'users', label: 'Utilisateurs', icon: Users, route: ROUTES.USERS },
  { id: 'organizations', label: 'Organisations', icon: Building2, route: ROUTES.ORGANIZATIONS },
  { id: 'themes', label: 'Thèmes', icon: Tag, route: ROUTES.THEMES },
  { id: 'licenses', label: 'Licences', icon: Scale, route: ROUTES.LICENSES },
  { id: 'analytics', label: 'Analytique', icon: BarChart3, route: ROUTES.ANALYTICS },
  { id: 'settings', label: 'Paramètres', icon: Settings, route: ROUTES.SETTINGS },
] as const

export const Sidebar = memo(function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const currentPage = useUIStore((state) => state.currentPage)
  const setCurrentPage = useUIStore((state) => state.setCurrentPage)
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const { user, isAuthenticated, logout } = useAuth()

  // Synchronize currentPage with pathname
  useEffect(() => {
    // Find the matching sidebar item based on pathname
    const currentItem = sidebarItems.find(item => {
      // Exact match or pathname starts with the route (for nested routes)
      return pathname === item.route || pathname.startsWith(item.route + '/')
    })
    
    if (currentItem && currentItem.id !== currentPage) {
      setCurrentPage(currentItem.id)
    } else if (!currentItem && (pathname === '/' || pathname === '')) {
      setCurrentPage('dashboard')
    }
  }, [pathname, currentPage, setCurrentPage])

  const handlePageChange = useCallback((pageId: string) => {
    const item = sidebarItems.find(i => i.id === pageId)
    if (item) {
      setCurrentPage(pageId)
      router.push(item.route)
    }
  }, [router, setCurrentPage])

  const handleLogin = useCallback(() => {
    router.push(ROUTES.LOGIN)
  }, [router])

  // Memoize user initials calculation
  const userInitials = useMemo(() => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [user?.name])

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Database className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">JDOM</h1>
            <p className="text-xs text-muted-foreground">Jeux de Données Ouverts</p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${currentPage === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name || 'Utilisateur'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </>
          ) : (
            <Button variant="default" className="w-full" size="sm" onClick={handleLogin}>
              <Lock className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
})

