/**
 * Organization Card component
 * Displays an organization in card format
 */

'use client'

import { Building2, MoreHorizontal, Users, ExternalLink, Edit, Trash2, Mail } from 'lucide-react'
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
import type { Organization } from '@/lib/types'

interface OrganizationCardProps {
  organization: Organization
  datasetsCount?: number
  onEdit?: (organization: Organization) => void
  onDelete?: (id: string) => void
}

export function OrganizationCard({
  organization,
  datasetsCount = 0,
  onEdit,
  onDelete,
}: OrganizationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{organization.name}</CardTitle>
              <CardDescription className="text-sm">{datasetsCount} datasets</CardDescription>
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
                <DropdownMenuItem onClick={() => onEdit(organization)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Voir utilisateurs
              </DropdownMenuItem>
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(organization.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {organization.description && (
          <p className="text-sm text-muted-foreground mb-4">{organization.description}</p>
        )}
        <div className="space-y-2 text-sm">
          {organization.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              {organization.email}
            </div>
          )}
          {organization.website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Site web
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

