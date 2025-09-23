import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@workspace/ui/components/dialog'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useDeleteCategory } from '@/hooks/trpc/category'
import type { CategoryWithSubcategories } from '../../../../types/menu-editor'

interface DeleteCategoryDialogProps {
  category: CategoryWithSubcategories | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

/**
 * Confirmation dialog component for category deletion
 * Handles cascade deletion warnings and provides proper user feedback
 */
export function DeleteCategoryDialog({ 
  category, 
  isOpen, 
  onClose, 
  onSuccess 
}: DeleteCategoryDialogProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { mutate: deleteCategory, isPending } = useDeleteCategory({
    onSuccess: () => {
      setDeleteError(null)
      onSuccess()
      onClose()
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete category. Please try again.'
      setDeleteError(errorMessage)
    },
  })

  const handleConfirmDelete = () => {
    if (!category) return
    
    setDeleteError(null)
    deleteCategory({
      where: {
        id: category.id
      }
    })
  }

  const handleCancel = () => {
    setDeleteError(null)
    onClose()
  }

  if (!category) return null

  const hasSubcategories = category.children && category.children.length > 0
  const totalItems = category._count.menuItems + 
    (category.children?.reduce((sum, sub) => sum + sub._count.menuItems, 0) || 0)
  const subcategoryCount = category._count.children

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the category and all its contents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Info */}
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-1">{category.name}</h4>
            {category.description && (
              <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
            )}
            
            {/* Impact Warning */}
            <div className="space-y-1 text-xs">
              {hasSubcategories && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{subcategoryCount} subcategories will be deleted</span>
                </div>
              )}
              {totalItems > 0 && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{totalItems} menu items will be deleted</span>
                </div>
              )}
              {!hasSubcategories && totalItems === 0 && (
                <div className="text-muted-foreground">
                  This category is empty and safe to delete.
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
            Are you sure you want to delete the category "{category.name}"?
            {(hasSubcategories || totalItems > 0) && (
              <span className="block mt-1 text-destructive font-medium">
                This will also delete all subcategories and menu items within this category.
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
                'Delete Category'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}