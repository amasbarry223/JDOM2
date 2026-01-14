/**
 * Dataset Filters component
 * Filter controls for datasets
 */

'use client'

import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useDatasetStore } from '@/store/datasetStore'
import { useThemeStore } from '@/store/themeStore'
import { useOrganizationStore } from '@/store/organizationStore'
import type { DatasetStatus } from '@/lib/types'

export function DatasetFilters() {
  const { filters, setFilters } = useDatasetStore()
  const { themes } = useThemeStore()
  const { organizations } = useOrganizationStore()
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    setFilters({ search: debouncedSearch || undefined })
  }, [debouncedSearch, setFilters])

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => {
              const status: DatasetStatus | undefined = value === 'all' ? undefined : (value as DatasetStatus)
              setFilters({ status })
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.themeId || 'all'}
            onValueChange={(value) => setFilters({ themeId: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les thèmes</SelectItem>
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.producerId || 'all'}
            onValueChange={(value) => setFilters({ producerId: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Producteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les producteurs</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => useDatasetStore.getState().clearFilters()}>
            <Filter className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

