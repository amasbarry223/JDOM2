/**
 * Stats Cards component
 * Displays key statistics in card format
 */

'use client'

import { memo } from 'react'
import { Database, Download, Eye, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils/format'

interface StatsCardsProps {
  totalDatasets: number
  publishedDatasets: number
  totalDownloads: number
  totalViews: number
  totalOrganizations: number
  activeUsers: number
}

export const StatsCards = memo(function StatsCards({
  totalDatasets,
  publishedDatasets,
  totalDownloads,
  totalViews,
  totalOrganizations,
  activeUsers,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDatasets}</div>
          <p className="text-xs text-muted-foreground">{publishedDatasets} publiés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Téléchargements</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalDownloads)}</div>
          <p className="text-xs text-muted-foreground">+12.5% ce mois</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Vues</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalViews)}</div>
          <p className="text-xs text-muted-foreground">+8.3% ce mois</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Organisations</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrganizations}</div>
          <p className="text-xs text-muted-foreground">{activeUsers} contributeurs actifs</p>
        </CardContent>
      </Card>
    </div>
  )
})

