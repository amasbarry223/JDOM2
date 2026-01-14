/**
 * Licenses Page
 * Page for managing licenses
 */

'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LicenseCard } from '@/components/licenses/LicenseCard'
import { LicenseForm } from '@/components/licenses/LicenseForm'
import { useLicenseStore } from '@/store/licenseStore'
import { useEntityModal } from '@/hooks/useEntityModal'
import type { LicenseFormData, License } from '@/lib/types'

export default function LicensesPage() {
  const { licenses, createLicense, updateLicense, deleteLicense, setSelectedLicense } = useLicenseStore()
  const selectedLicense = useLicenseStore((state) => state.selectedLicense)
  // Stores are initialized by useInitializeStores in the layout

  const { isOpen, handleAdd, handleEdit, handleDelete, handleSave, closeModal: handleClose } = useEntityModal<License>({
    modalKey: 'license',
    entityName: 'Licence',
    onCreate: async (data: LicenseFormData) => {
      const result = await createLicense(data)
      return { success: !!result }
    },
    onUpdate: async (id: string, data: LicenseFormData) => {
      const result = await updateLicense(id, data)
      return { success: !!result }
    },
    onDelete: deleteLicense,
    setSelectedEntity: setSelectedLicense,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Licences</h2>
          <p className="text-muted-foreground">Gestion des licences d'utilisation</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Licence
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {licenses.map((license) => (
          <LicenseCard
            key={license.id}
            license={license}
            onEdit={handleEdit}
            onView={(license) => {
              if (license.url) {
                window.open(license.url, '_blank')
              }
            }}
          />
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => (!open && handleClose())}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedLicense ? 'Modifier la Licence' : 'Nouvelle Licence'}</DialogTitle>
            <DialogDescription>Ajouter une nouvelle licence d'utilisation</DialogDescription>
          </DialogHeader>
          <LicenseForm
            license={selectedLicense}
            onSave={(data) => handleSave(data, selectedLicense)}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

