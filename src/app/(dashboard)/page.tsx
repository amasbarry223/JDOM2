/**
 * Dashboard Page
 * Main dashboard page with overview statistics
 */

'use client'

import { useMemo, useCallback, lazy, Suspense } from 'react'
import { RefreshCw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatsCards } from '@/components/dashboard/StatsCards'

// Lazy load heavy components for code splitting
const RecentDatasets = lazy(() => import('@/components/dashboard/RecentDatasets').then(module => ({ default: module.RecentDatasets })))
const DatasetsByTheme = lazy(() => import('@/components/dashboard/DatasetsByTheme').then(module => ({ default: module.DatasetsByTheme })))
import { useOrganizationStore } from '@/store/organizationStore'
import { useThemeStore } from '@/store/themeStore'
import { useDatasetStore } from '@/store/datasetStore'
import { useUserStore } from '@/store/userStore'
import { formatNumber } from '@/lib/utils/format'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  // Use selectors to avoid unnecessary re-renders
  // Stores are initialized by useInitializeStores in the layout
  const datasets = useDatasetStore((state) => state.datasets)
  const users = useUserStore((state) => state.users)
  const organizations = useOrganizationStore((state) => state.organizations)
  const themes = useThemeStore((state) => state.themes)

  // Memoize expensive calculations
  const stats = useMemo(() => ({
    totalDatasets: datasets.length,
    publishedDatasets: datasets.filter((d) => d.status === 'published').length,
    totalDownloads: datasets.reduce((sum, d) => sum + d.downloadsCount, 0),
    totalViews: datasets.reduce((sum, d) => sum + d.viewsCount, 0),
    totalUsers: users.length,
    totalOrganizations: organizations.length,
    activeUsers: users.filter((u) => u.role !== 'public').length,
  }), [datasets, users, organizations])

  // Memoize themes with counts calculation
  const themesWithCounts = useMemo(() => {
    const themeMap = new Map<string, number>()
    datasets.forEach((d) => {
      if (d.themeId) {
        themeMap.set(d.themeId, (themeMap.get(d.themeId) || 0) + 1)
      }
    })
    return themes.map((theme) => ({
      ...theme,
      datasetsCount: themeMap.get(theme.id) || 0,
    }))
  }, [themes, datasets])

  // Memoize top datasets calculation
  const topDatasets = useMemo(() => {
    return [...datasets]
      .sort((a, b) => b.downloadsCount - a.downloadsCount)
      .slice(0, 5)
  }, [datasets])

  // Memoize theme lookup map for O(1) access
  const themeMap = useMemo(() => {
    return new Map(themes.map((t) => [t.id, t.name]))
  }, [themes])

  // Memoize callbacks
  const handleRefresh = useCallback(() => {
    // Refresh logic
  }, [])

  const handleExport = useCallback(() => {
    // Export logic
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme JDOM</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <StatsCards
        totalDatasets={stats.totalDatasets}
        publishedDatasets={stats.publishedDatasets}
        totalDownloads={stats.totalDownloads}
        totalViews={stats.totalViews}
        totalOrganizations={stats.totalOrganizations}
        activeUsers={stats.activeUsers}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-64" />}>
          <DatasetsByTheme themes={themesWithCounts} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64" />}>
          <RecentDatasets datasets={datasets} maxItems={5} />
        </Suspense>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Datasets</CardTitle>
          <CardDescription>Les jeux de données les plus téléchargés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Producteur</TableHead>
                <TableHead>Thème</TableHead>
                <TableHead>Téléchargements</TableHead>
                <TableHead>Vues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topDatasets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Aucun dataset trouvé
                  </TableCell>
                </TableRow>
              ) : (
                topDatasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>{dataset.title}</TableCell>
                    <TableCell>{dataset.producerId}</TableCell>
                    <TableCell>
                      {dataset.themeId ? (themeMap.get(dataset.themeId) || '-') : '-'}
                    </TableCell>
                    <TableCell>{formatNumber(dataset.downloadsCount)}</TableCell>
                    <TableCell>{formatNumber(dataset.viewsCount)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

