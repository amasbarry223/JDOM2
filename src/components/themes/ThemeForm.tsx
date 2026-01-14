/**
 * Theme Form component
 * Form for creating/editing themes
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DialogFooter } from '@/components/ui/dialog'
import type { Theme, ThemeFormData } from '@/lib/types'
import { generateSlug } from '@/lib/utils/validation'

interface ThemeFormProps {
  theme?: Theme | null
  onSave: (data: ThemeFormData) => void
  onCancel: () => void
}

export function ThemeForm({ theme, onSave, onCancel }: ThemeFormProps) {
  const [name, setName] = useState(theme?.name || '')
  const [slug, setSlug] = useState(theme?.slug || '')
  const [description, setDescription] = useState(theme?.description || '')

  const handleNameChange = (value: string) => {
    setName(value)
    if (!theme && !slug) {
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
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="themeName">Nom *</Label>
        <Input
          id="themeName"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Nom du thème"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="themeSlug">Slug *</Label>
        <Input
          id="themeSlug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-du-theme"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="themeDescription">Description</Label>
        <Textarea
          id="themeDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du thème"
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{theme ? 'Modifier' : 'Créer'}</Button>
      </DialogFooter>
    </form>
  )
}

