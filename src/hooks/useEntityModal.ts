/**
 * Entity Modal Hook
 * Generic hook for managing entity modals (create/edit/delete)
 */

import { useCallback } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useToast } from '@/hooks/use-toast'
import { logger } from '@/lib/utils/logger'

interface UseEntityModalOptions<T> {
  modalKey: string
  entityName: string
  onCreate?: (data: any) => Promise<{ success: boolean; error?: string }>
  onUpdate?: (id: string, data: any) => Promise<{ success: boolean; error?: string }>
  onDelete?: (id: string) => Promise<boolean>
  setSelectedEntity?: (entity: T | null) => void
  successMessages?: {
    create?: string
    update?: string
    delete?: string
  }
  errorMessages?: {
    create?: string
    update?: string
    delete?: string
  }
}

export function useEntityModal<T>({
  modalKey,
  entityName,
  onCreate,
  onUpdate,
  onDelete,
  setSelectedEntity,
  successMessages = {},
  errorMessages = {},
}: UseEntityModalOptions<T>) {
  const { toast } = useToast()
  const { modals, openModal, closeModal } = useUIStore()

  const handleAdd = useCallback(() => {
    if (setSelectedEntity) {
      setSelectedEntity(null)
    }
    openModal(modalKey)
  }, [modalKey, openModal, setSelectedEntity])

  const handleEdit = useCallback(
    (entity: T) => {
      if (setSelectedEntity) {
        setSelectedEntity(entity)
      }
      openModal(modalKey)
    },
    [modalKey, openModal, setSelectedEntity]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (!onDelete) return

      try {
        const success = await onDelete(id)
        if (success) {
          toast({
            title: successMessages.delete || `${entityName} supprimé(e)`,
            description: `Le/La ${entityName.toLowerCase()} a été supprimé(e) avec succès.`,
          })
        } else {
          toast({
            title: 'Erreur',
            description: errorMessages.delete || 'Erreur lors de la suppression',
            variant: 'destructive',
          })
        }
      } catch (error) {
        logger.error(`Error deleting ${entityName}`, error)
        toast({
          title: 'Erreur',
          description: errorMessages.delete || 'Erreur lors de la suppression',
          variant: 'destructive',
        })
      }
    },
    [onDelete, toast, entityName, successMessages.delete, errorMessages.delete]
  )

  const handleSave = useCallback(
    async (data: any, selectedEntity?: T | null) => {
      try {
        if (selectedEntity && onUpdate && 'id' in selectedEntity) {
          // Update existing entity
          const result = await onUpdate((selectedEntity as any).id, data)
          if (result.success) {
            toast({
              title: successMessages.update || `${entityName} modifié(e)`,
              description: `Les modifications ont été enregistrées avec succès.`,
            })
            closeModal(modalKey)
          } else {
            logger.error(`Failed to update ${entityName}`, {
              id: (selectedEntity as any).id,
              error: result.error,
            })
            toast({
              title: 'Erreur',
              description: result.error || errorMessages.update || 'Erreur lors de la modification',
              variant: 'destructive',
            })
          }
        } else if (onCreate) {
          // Create new entity
          const result = await onCreate(data)
          if (result.success) {
            toast({
              title: successMessages.create || `${entityName} créé(e)`,
              description: `Le/La ${entityName.toLowerCase()} a été créé(e) avec succès.`,
            })
            closeModal(modalKey)
          } else {
            logger.error(`Failed to create ${entityName}`, { error: result.error })
            toast({
              title: 'Erreur',
              description: result.error || errorMessages.create || 'Erreur lors de la création',
              variant: 'destructive',
            })
          }
        }
      } catch (error) {
        logger.error(`Error saving ${entityName}`, error)
        toast({
          title: 'Erreur',
          description: errorMessages.create || errorMessages.update || 'Erreur lors de la sauvegarde',
          variant: 'destructive',
        })
      }
    },
    [
      onCreate,
      onUpdate,
      toast,
      entityName,
      modalKey,
      closeModal,
      successMessages.create,
      successMessages.update,
      errorMessages.create,
      errorMessages.update,
    ]
  )

  const handleClose = useCallback(() => {
    closeModal(modalKey)
    if (setSelectedEntity) {
      setSelectedEntity(null)
    }
  }, [modalKey, closeModal, setSelectedEntity])

  return {
    isOpen: modals[modalKey as keyof typeof modals] || false,
    openModal: () => openModal(modalKey),
    closeModal: handleClose,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
  }
}

