/**
 * Organizations Page
 * Page for managing organizations
 */

'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { OrganizationCard } from '@/components/organizations/OrganizationCard'
import { OrganizationForm } from '@/components/organizations/OrganizationForm'
import { useOrganizationStore } from '@/store/organizationStore'
import { useEntityModal } from '@/hooks/useEntityModal'
import type { OrganizationFormData, Organization } from '@/lib/types'

export default function OrganizationsPage() {
  const { organizations, createOrganization, updateOrganization, deleteOrganization, setSelectedOrganization } = useOrganizationStore()
  const selectedOrg = useOrganizationStore((state) => state.selectedOrganization)
  // Stores are initialized by useInitializeStores in the layout

  const { isOpen, handleAdd, handleEdit, handleDelete, handleSave, closeModal: handleClose } = useEntityModal<Organization>({
    modalKey: 'organization',
    entityName: 'Organisation',
    onCreate: async (data: OrganizationFormData) => {
      const result = await createOrganization(data)
      return { success: !!result }
    },
    onUpdate: async (id: string, data: OrganizationFormData) => {
      const result = await updateOrganization(id, data)
      return { success: !!result }
    },
    onDelete: deleteOrganization,
    setSelectedEntity: setSelectedOrganization,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organisations</h2>
          <p className="text-muted-foreground">Gestion des organisations productrices</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Organisation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <OrganizationCard
            key={org.id}
            organization={org}
            datasetsCount={0}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => (!open && handleClose())}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedOrg ? "Modifier l'Organisation" : 'Nouvelle Organisation'}</DialogTitle>
            <DialogDescription>Remplissez les informations de l'organisation</DialogDescription>
          </DialogHeader>
          <OrganizationForm
            organization={selectedOrg}
            onSave={(data) => handleSave(data, selectedOrg)}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

