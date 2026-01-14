/**
 * License Form component
 * Form for creating/editing licenses
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DialogFooter } from '@/components/ui/dialog'
import type { License, LicenseFormData } from '@/lib/types'
import { generateSlug } from '@/lib/utils/validation'

interface LicenseFormProps {
  license?: License | null
  onSave: (data: LicenseFormData) => void
  onCancel: () => void
}

export function LicenseForm({ license, onSave, onCancel }: LicenseFormProps) {
  const [name, setName] = useState(license?.name || '')
  const [slug, setSlug] = useState(license?.slug || '')
  const [description, setDescription] = useState(license?.description || '')
  const [url, setUrl] = useState(license?.url || '')

  const handleNameChange = (value: string) => {
    setName(value)
    if (!license && !slug) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) {
      return
    }
    onSave({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      url: url.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="licenseName">Nom *</Label>
        <Input
          id="licenseName"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Nom de la licence"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseSlug">Slug *</Label>
        <Input
          id="licenseSlug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-de-la-licence"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseDescription">Description</Label>
        <Textarea
          id="licenseDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de la licence"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseUrl">URL</Label>
        <Input
          id="licenseUrl"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{license ? 'Modifier' : 'Créer'}</Button>
      </DialogFooter>
    </form>
  )
}

