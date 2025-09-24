import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@workspace/ui/components/dialog'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteMenuItem } from '@workspace/db/hooks/trpc/menu-item'

interface DeleteMenuItemDialogProps {
  menuItem: any | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

/**
 * Confirmation dialog component for menu item deletion
 * Handles deletion warnings and provides proper user feedback
 */
export function DeleteMenuItemDialog({
  menuItem,
  isOpen,
  onClose,
  onSuccess
}: DeleteMenuItemDialogProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { mutate: deleteMenuItem, isPending } = useDeleteMenuItem({
    onSuccess: () => {
      setDeleteError(null)
      toast.success('Menu item deleted successfully')
      onSuccess()
      onClose()
    },
    onError: (error: any) => {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to delete menu item. Please try again.'
      setDeleteError(errorMessage)
      toast.error(errorMessage)
    },
  })

  const handleConfirmDelete = () => {
    if (!menuItem) return

    setDeleteError(null)
    deleteMenuItem({
      where: {
        id: menuItem.id
      }
    })
  }

  const handleCancel = () => {
    setDeleteError(null)
    onClose()
  }

  if (!menuItem) return null

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Menu Item
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the menu item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Menu Item Info */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm">{menuItem.name}</h4>
              <span className="text-sm font-medium text-primary">
                {formatPrice(menuItem.price)}
              </span>
            </div>

            {menuItem.description && (
              <p className="text-xs text-muted-foreground mb-2">{menuItem.description}</p>
            )}

            {/* Status Info */}
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${menuItem.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
                }`}>
                {menuItem.isActive ? 'Active' : 'Inactive'}
              </span>
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
            Are you sure you want to delete the menu item "{menuItem.name}"?
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
                'Delete Item'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}