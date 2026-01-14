/**
 * Datasets by Theme component
 * Displays datasets distribution by theme
 */

'use client'

import { memo, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Theme } from '@/lib/types'

interface ThemeWithCount extends Theme {
  datasetsCount: number
}

interface DatasetsByThemeProps {
  themes: ThemeWithCount[]
}

export const DatasetsByTheme = memo(function DatasetsByTheme({ themes }: DatasetsByThemeProps) {
  // Memoize max count calculation
  const maxCount = useMemo(() => {
    return Math.max(...themes.map((t) => t.datasetsCount), 1)
  }, [themes])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datasets par Thème</CardTitle>
        <CardDescription>Répartition des jeux de données par catégorie</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {themes.map((theme) => (
            <div key={theme.id} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{theme.name}</span>
                  <span className="text-sm text-muted-foreground">{theme.datasetsCount}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(theme.datasetsCount / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

