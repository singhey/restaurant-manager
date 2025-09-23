import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@workspace/ui/components/dialog'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteCategory } from '@/hooks/trpc/category'
import type { SubcategoryWithItems } from '../../../../types/menu-editor'

interface DeleteSubcategoryDialogProps {
  subcategory: SubcategoryWithItems | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

/**
 * Confirmation dialog component for subcategory deletion
 * Handles deletion warnings for subcategories with items and provides proper user feedback
 */
export function DeleteSubcategoryDialog({ 
  subcategory, 
  isOpen, 
  onClose, 
  onSuccess 
}: DeleteSubcategoryDialogProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { mutate: deleteSubcategory, isPending } = useDeleteCategory({
    onSuccess: () => {
      setDeleteError(null)
      toast.success('Subcategory deleted successfully')
      onSuccess()
      onClose()
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete subcategory. Please try again.'
      setDeleteError(errorMessage)
      toast.error(errorMessage)
    },
  })

  const handleConfirmDelete = () => {
    if (!subcategory) return
    
    setDeleteError(null)
    deleteSubcategory({
      where: {
        id: subcategory.id
      }
    })
  }

  const handleCancel = () => {
    setDeleteError(null)
    onClose()
  }

  if (!subcategory) return null

  const itemCount = subcategory._count.menuItems

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Subcategory
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the subcategory and all its contents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subcategory Info */}
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-1">{subcategory.name}</h4>
            {subcategory.description && (
              <p className="text-xs text-muted-foreground mb-2">{subcategory.description}</p>
            )}
            
            {/* Impact Warning */}
            <div className="space-y-1 text-xs">
              {itemCount > 0 && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{itemCount} menu items will be deleted</span>
                </div>
              )}
              {itemCount === 0 && (
                <div className="text-muted-foreground">
                  This subcategory is empty and safe to delete.
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {deleteError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {deleteError}
            </div>
          )}

          {/* Warning Message */}
          <div className="text-sm text-muted-foreground">
            Are you sure you want to delete the subcategory "{subcategory.name}"?
            {itemCount > 0 && (
              <span className="block mt-1 text-destructive font-medium">
                This will also delete all {itemCount} menu items within this subcategory.
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isPending}
              className="min-w-[100px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Subcategory'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}