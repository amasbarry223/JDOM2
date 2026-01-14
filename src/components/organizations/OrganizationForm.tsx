/**
 * Organization Form component
 * Form for creating/editing organizations
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DialogFooter } from '@/components/ui/dialog'
import type { Organization, OrganizationFormData } from '@/lib/types'

interface OrganizationFormProps {
  organization?: Organization | null
  onSave: (data: OrganizationFormData) => void
  onCancel: () => void
}

export function OrganizationForm({ organization, onSave, onCancel }: OrganizationFormProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: organization?.name || '',
    description: organization?.description || '',
    email: organization?.email || '',
    website: organization?.website || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="orgName">Nom *</Label>
        <Input
          id="orgName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nom de l'organisation"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orgDescription">Description</Label>
        <Textarea
          id="orgDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description de l'organisation"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orgEmail">Email</Label>
        <Input
          id="orgEmail"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="contact@organisation.ml"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orgWebsite">Site web</Label>
        <Input
          id="orgWebsite"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://www.organisation.ml"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{organization ? 'Modifier' : 'Créer'}</Button>
      </DialogFooter>
    </form>
  )
}

