import React, { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Trash2, MoreVertical } from 'lucide-react'
import type { SubcategoryItemProps } from '../../types/menu-editor'

/**
 * Component for displaying individual subcategories within expanded categories
 * Shows subcategory name, item count, and delete functionality
 */
export function SubcategoryItem({
  subcategory,
  onDelete,
  onReorder,
}: SubcategoryItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const itemCount = subcategory._count.menuItems

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(subcategory.id)
    setShowDeleteConfirm(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <div className="border border-border/50 rounded bg-card/50">
      {/* Subcategory Header */}
      <div className="flex items-center gap-2 p-2">
        {/* Indent Indicator */}
        <div className="w-4 flex justify-center">
          <div className="w-px h-4 bg-border"></div>
        </div>

        {/* Subcategory Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{subcategory.name}</h4>
            
            {/* Item Count Badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
              {itemCount} items
            </span>
          </div>
          
          {/* Subcategory Description */}
          {subcategory.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {subcategory.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
            title="Delete Subcategory"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          {/* Drag Handle (Future: Drag and Drop) */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted cursor-grab"
            title="Drag to reorder or move to different category"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="border-t border-border bg-destructive/5 p-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">Delete Subcategory?</p>
              <p className="text-xs text-muted-foreground">
                This will delete {itemCount} items in this subcategory
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteConfirm}
                className="h-7 text-xs"
              >
                Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDeleteCancel}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}