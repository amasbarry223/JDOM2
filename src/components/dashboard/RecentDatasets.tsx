/**
 * Recent Datasets component
 * Displays the most recently added datasets
 */

'use client'

import { memo, useMemo } from 'react'
import { Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Dataset } from '@/lib/types'

interface RecentDatasetsProps {
  datasets: Dataset[]
  maxItems?: number
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive'> = {
  published: 'default',
  draft: 'secondary',
  archived: 'destructive',
} as const

const STATUS_LABELS: Record<string, string> = {
  published: 'Publié',
  draft: 'Brouillon',
  archived: 'Archivé',
} as const

function getStatusBadge(status: string) {
  return (
    <Badge variant={STATUS_VARIANTS[status] || 'secondary'}>
      {STATUS_LABELS[status] || status}
    </Badge>
  )
}

export const RecentDatasets = memo(function RecentDatasets({ datasets, maxItems = 5 }: RecentDatasetsProps) {
  // Memoize sorted datasets to avoid re-sorting on every render
  const recentDatasets = useMemo(() => {
    return [...datasets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, maxItems)
  }, [datasets, maxItems])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datasets Récents</CardTitle>
        <CardDescription>Les derniers jeux de données ajoutés</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentDatasets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun dataset récent</p>
          ) : (
            recentDatasets.map((dataset) => (
              <div key={dataset.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <Database className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{dataset.title}</p>
                  <p className="text-xs text-muted-foreground">{dataset.producerId}</p>
                </div>
                <div className="flex items-center gap-2">{getStatusBadge(dataset.status)}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
})

