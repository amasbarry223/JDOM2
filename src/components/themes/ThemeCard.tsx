/**
 * Theme Card component
 * Displays a theme in card format
 */

'use client'

import { Tag, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, Trash2 } from 'lucide-react'
import type { Theme } from '@/lib/types'

interface ThemeCardProps {
  theme: Theme
  datasetsCount?: number
  onEdit?: (theme: Theme) => void
  onDelete?: (id: string) => void
}

export function ThemeCard({ theme, datasetsCount = 0, onEdit, onDelete }: ThemeCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{theme.name}</CardTitle>
              <CardDescription className="text-xs">{theme.slug}</CardDescription>
            </div>
          </div>
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
                <DropdownMenuItem onClick={() => onEdit(theme)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(theme.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {theme.description && (
          <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Datasets</span>
          <Badge variant="secondary">{datasetsCount}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

