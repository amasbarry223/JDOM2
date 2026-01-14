/**
 * Datasets Page
 * Page for managing datasets
 */

'use client'

import { lazy, Suspense, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { DatasetFilters } from '@/components/datasets/DatasetFilters'
import { DatasetTable } from '@/components/datasets/DatasetTable'
import { useDatasets } from '@/hooks/useDatasets'
import { useOrganizationStore } from '@/store/organizationStore'
import { useThemeStore } from '@/store/themeStore'
import { useLicenseStore } from '@/store/licenseStore'
import { useUIStore } from '@/store/uiStore'
import { useDatasetStore } from '@/store/datasetStore'
import { useToast } from '@/hooks/use-toast'
import { logger } from '@/lib/utils/logger'
import type { DatasetFormData, Dataset } from '@/lib/types'

// Lazy load the form component for code splitting
const DatasetForm = lazy(() => import('@/components/datasets/DatasetForm').then(module => ({ default: module.DatasetForm })))

export default function DatasetsPage() {
  const { toast } = useToast()
  const { datasets, filteredDatasets, createDataset, updateDataset, deleteDataset } = useDatasets({
    autoFetch: false,
  })
  const { organizations } = useOrganizationStore()
  const { themes } = useThemeStore()
  const { licenses } = useLicenseStore()
  const { modals, openModal, closeModal } = useUIStore()
  const { selectedDataset, setSelectedDataset } = useDatasetStore()
  // Stores are initialized by useInitializeStores in the layout

  const handleAdd = useCallback(() => {
    setSelectedDataset(null)
    openModal('dataset')
  }, [openModal, setSelectedDataset])

  const handleEdit = useCallback((dataset: Dataset) => {
    setSelectedDataset(dataset)
    openModal('dataset')
  }, [openModal, setSelectedDataset])

  const handleDelete = useCallback(async (id: string) => {
    const result = await deleteDataset(id)
    if (result.success) {
      toast({
        title: 'Dataset supprimé',
        description: 'Le dataset a été supprimé avec succès.',
      })
    } else {
      logger.error('Failed to delete dataset', { id, error: result.error })
      toast({
        title: 'Erreur',
        description: result.error || 'Erreur lors de la suppression',
        variant: 'destructive',
      })
    }
  }, [deleteDataset, toast])

  const handleSave = useCallback(async (data: DatasetFormData) => {
    if (selectedDataset) {
      const result = await updateDataset(selectedDataset.id, data)
      if (result.success) {
        toast({
          title: 'Dataset modifié',
          description: 'Les modifications ont été enregistrées avec succès.',
        })
        closeModal('dataset')
      } else {
        logger.error('Failed to update dataset', { id: selectedDataset.id, error: result.error })
        toast({
          title: 'Erreur',
          description: result.error || 'Erreur lors de la modification',
          variant: 'destructive',
        })
      }
    } else {
      const result = await createDataset(data)
      if (result.success) {
        toast({
          title: 'Dataset créé',
          description: 'Le nouveau dataset a été créé avec succès.',
        })
        closeModal('dataset')
      } else {
        logger.error('Failed to create dataset', { error: result.error })
        toast({
          title: 'Erreur',
          description: result.error || 'Erreur lors de la création',
          variant: 'destructive',
        })
      }
    }
  }, [selectedDataset, createDataset, updateDataset, closeModal, toast])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jeux de Données</h2>
          <p className="text-muted-foreground">Gestion des jeux de données publiques</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Dataset
        </Button>
      </div>

      <DatasetFilters />

      <DatasetTable
        datasets={filteredDatasets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={modals.dataset} onOpenChange={(open) => (open ? openModal('dataset') : closeModal('dataset'))}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDataset ? 'Modifier le Dataset' : 'Nouveau Dataset'}</DialogTitle>
            <DialogDescription>Remplissez les informations du jeu de données</DialogDescription>
          </DialogHeader>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <DatasetForm
              dataset={selectedDataset}
              organizations={organizations}
              themes={themes}
              licenses={licenses}
              onSave={handleSave}
              onCancel={() => closeModal('dataset')}
            />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  )
}
