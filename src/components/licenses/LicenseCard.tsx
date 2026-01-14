/**
 * License Card component
 * Displays a license in card format
 */

'use client'

import { Scale, MoreHorizontal, ExternalLink, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { License } from '@/lib/types'

interface LicenseCardProps {
  license: License
  onEdit?: (license: License) => void
  onView?: (license: License) => void
}

export function LicenseCard({ license, onEdit, onView }: LicenseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{license.name}</CardTitle>
              <CardDescription className="text-xs">{license.slug}</CardDescription>
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
                <DropdownMenuItem onClick={() => onEdit(license)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
              )}
              {onView && (
                <DropdownMenuItem onClick={() => onView(license)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir détails
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {license.description && (
          <p className="text-sm text-muted-foreground mb-3">{license.description}</p>
        )}
        {license.url && (
          <a
            href={license.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Voir la licence
          </a>
        )}
      </CardContent>
    </Card>
  )
}

