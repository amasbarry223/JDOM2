/**
 * Dataset Form component
 * Form for creating/editing datasets
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { DialogFooter } from '@/components/ui/dialog'
import type { Dataset, DatasetFormData, DatasetFormat, DatasetStatus } from '@/lib/types'
import type { Organization, Theme, License } from '@/lib/types'

interface DatasetFormProps {
  dataset?: Dataset | null
  organizations: Organization[]
  themes: Theme[]
  licenses: License[]
  onSave: (data: DatasetFormData) => void
  onCancel: () => void
}

export function DatasetForm({
  dataset,
  organizations,
  themes,
  licenses,
  onSave,
  onCancel,
}: DatasetFormProps) {
  const [formData, setFormData] = useState<DatasetFormData>({
    title: dataset?.title || '',
    shortDescription: dataset?.shortDescription || '',
    description: dataset?.description || '',
    format: (dataset?.format as DatasetFormat) || 'CSV',
    status: (dataset?.status as DatasetStatus) || 'draft',
    updateFrequency: dataset?.updateFrequency || 'Annuelle',
    producerId: dataset?.producerId || '',
    themeId: dataset?.themeId || '',
    licenseId: dataset?.licenseId || licenses[0]?.id || '',
    featured: dataset?.featured || false,
    spatialCoverage: dataset?.spatialCoverage || '',
    temporalCoverage: dataset?.temporalCoverage || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Titre du jeu de données"
            required
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">Description courte</Label>
          <Textarea
            id="description"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Description courte du jeu de données"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Format *</Label>
          <Select
            value={formData.format}
            onValueChange={(value) => setFormData({ ...formData, format: value as DatasetFormat })}
          >
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CSV">CSV</SelectItem>
              <SelectItem value="JSON">JSON</SelectItem>
              <SelectItem value="XML">XML</SelectItem>
              <SelectItem value="XLSX">XLSX</SelectItem>
              <SelectItem value="API">API</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as DatasetStatus })}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="producer">Producteur *</Label>
          <Select
            value={formData.producerId}
            onValueChange={(value) => setFormData({ ...formData, producerId: value })}
          >
            <SelectTrigger id="producer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Thème</Label>
          <Select
            value={formData.themeId || 'none'}
            onValueChange={(value) => setFormData({ ...formData, themeId: value === 'none' ? undefined : value })}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Sélectionner un thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun thème</SelectItem>
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="license">Licence *</Label>
          <Select
            value={formData.licenseId}
            onValueChange={(value) => setFormData({ ...formData, licenseId: value })}
          >
            <SelectTrigger id="license">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {licenses.map((license) => (
                <SelectItem key={license.id} value={license.id}>
                  {license.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Fréquence de mise à jour</Label>
          <Select
            value={formData.updateFrequency || 'Annuelle'}
            onValueChange={(value) => setFormData({ ...formData, updateFrequency: value })}
          >
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Quotidienne">Quotidienne</SelectItem>
              <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
              <SelectItem value="Mensuelle">Mensuelle</SelectItem>
              <SelectItem value="Trimestrielle">Trimestrielle</SelectItem>
              <SelectItem value="Annuelle">Annuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 col-span-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured">Dataset à la une</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{dataset ? 'Modifier' : 'Créer'}</Button>
      </DialogFooter>
    </form>
  )
}

