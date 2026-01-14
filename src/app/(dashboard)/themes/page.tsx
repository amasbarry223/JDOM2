/**
 * Themes Page
 * Page for managing themes
 */

'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ThemeCard } from '@/components/themes/ThemeCard'
import { ThemeForm } from '@/components/themes/ThemeForm'
import { useThemeStore } from '@/store/themeStore'
import { useDatasetStore } from '@/store/datasetStore'
import { useEntityModal } from '@/hooks/useEntityModal'
import type { ThemeFormData, Theme } from '@/lib/types'

export default function ThemesPage() {
  const { themes, createTheme, updateTheme, deleteTheme, setSelectedTheme } = useThemeStore()
  const { datasets } = useDatasetStore()
  const selectedTheme = useThemeStore((state) => state.selectedTheme)
  // Stores are initialized by useInitializeStores in the layout

  const { isOpen, handleAdd, handleEdit, handleDelete, handleSave, closeModal: handleClose } = useEntityModal<Theme>({
    modalKey: 'theme',
    entityName: 'Thème',
    onCreate: async (data: ThemeFormData) => {
      const result = await createTheme(data)
      return { success: !!result }
    },
    onUpdate: async (id: string, data: ThemeFormData) => {
      const result = await updateTheme(id, data)
      return { success: !!result }
    },
    onDelete: deleteTheme,
    setSelectedEntity: setSelectedTheme,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Thèmes</h2>
          <p className="text-muted-foreground">Gestion des catégories de jeux de données</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Thème
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => {
          const datasetsCount = datasets.filter((d) => d.themeId === theme.id).length
          return (
            <ThemeCard
              key={theme.id}
              theme={theme}
              datasetsCount={datasetsCount}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => (!open && handleClose())}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTheme ? 'Modifier le Thème' : 'Nouveau Thème'}</DialogTitle>
            <DialogDescription>Créer une nouvelle catégorie de jeu de données</DialogDescription>
          </DialogHeader>
          <ThemeForm
            theme={selectedTheme}
            onSave={(data) => handleSave(data, selectedTheme)}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

