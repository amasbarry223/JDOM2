/**
 * Dataset Table component
 * Displays datasets in a table format
 */

'use client'

import { memo, useCallback } from 'react'
import { Eye, Download, Edit, Trash2, MoreHorizontal, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatNumber } from '@/lib/utils/format'
import type { Dataset } from '@/lib/types'

interface DatasetTableProps {
  datasets: Dataset[]
  onEdit?: (dataset: Dataset) => void
  onDelete?: (id: string) => void
  onView?: (dataset: Dataset) => void
}

// Memoize status badge configuration
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

// Memoized row component to prevent unnecessary re-renders
const DatasetTableRow = memo(({ 
  dataset, 
  onEdit, 
  onDelete, 
  onView 
}: { 
  dataset: Dataset
  onEdit?: (dataset: Dataset) => void
  onDelete?: (id: string) => void
  onView?: (dataset: Dataset) => void
}) => {
  const handleEdit = useCallback(() => {
    onEdit?.(dataset)
  }, [dataset, onEdit])

  const handleDelete = useCallback(() => {
    onDelete?.(dataset.id)
  }, [dataset.id, onDelete])

  const handleView = useCallback(() => {
    onView?.(dataset)
  }, [dataset, onView])

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {dataset.featured && (
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          )}
          {dataset.title}
        </div>
      </TableCell>
      <TableCell className="max-w-xs truncate text-muted-foreground">
        {dataset.shortDescription || '-'}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{dataset.format}</Badge>
      </TableCell>
      <TableCell>{dataset.producerId}</TableCell>
      <TableCell>{dataset.themeId || '-'}</TableCell>
      <TableCell>{getStatusBadge(dataset.status)}</TableCell>
      <TableCell>{formatNumber(dataset.downloadsCount)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
            )}
            {onView && (
              <DropdownMenuItem onClick={handleView}>
                <Eye className="h-4 w-4 mr-2" />
                Voir détails
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </DropdownMenuItem>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
})

DatasetTableRow.displayName = 'DatasetTableRow'

export const DatasetTable = memo(function DatasetTable({ datasets, onEdit, onDelete, onView }: DatasetTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Producteur</TableHead>
            <TableHead>Thème</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Téléchargements</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                Aucun dataset trouvé
              </TableCell>
            </TableRow>
              ) : (
            datasets.map((dataset) => (
              <DatasetTableRow
                key={dataset.id}
                dataset={dataset}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
})

