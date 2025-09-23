import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Trash2, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DeleteSubcategoryDialog } from '../dialogs/DeleteSubcategoryDialog'
import { DisabledOverlay } from '../ui/DisabledOverlay'
import { useSortingPreference } from '@/hooks/useSortingPreference'
import type { SubcategoryItemProps } from '@/types/menu-editor'

/**
 * Component for displaying individual subcategories within expanded categories
 * Shows subcategory name, item count, and delete functionality
 */
export function SubcategoryItem({
  subcategory,
  onDelete: _onDelete,
  onReorder: _onReorder,
}: SubcategoryItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { isAlphabeticalSort } = useSortingPreference()

  // Set up drag and drop for subcategories
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: subcategory.id,
    data: {
      type: 'subcategory',
      id: subcategory.id,
      parentId: subcategory.parentId,
      name: subcategory.name,
      sortOrder: subcategory.sortOrder,
    },
    disabled: isAlphabeticalSort, // Disable dragging when alphabetical sorting is active
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteSuccess = () => {
    // The dialog handles the actual deletion via useDeleteCategory hook
    // We just need to close the dialog - the parent will refresh data
    setShowDeleteDialog(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`relative border border-border/50 rounded bg-card/50 reorder-transition ${
        isDragging 
          ? 'subcategory-dragging' 
          : 'item-hover'
      } ${
        isAlphabeticalSort
          ? 'disabled-drag'
          : ''
      }`}
    >
      {/* Subcategory Header */}
      <div className={`flex items-center gap-2 p-2 transition-all duration-200 ${
        isDragging
          ? 'bg-primary/5'
          : ''
      } ${
        isAlphabeticalSort
          ? 'bg-muted/20'
          : ''
      }`}>
        {/* Indent Indicator */}
        <div className="w-4 flex justify-center">
          <div className="w-px h-4 bg-border"></div>
        </div>

        {/* Subcategory Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{subcategory.name}</h4>
          </div>
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

          {/* Drag Handle */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 w-7 p-0 drag-handle ${
              isAlphabeticalSort 
                ? '' 
                : 'cursor-grab active:cursor-grabbing hover:bg-primary/10 hover:text-primary'
            } ${isDragging ? 'cursor-grabbing bg-primary/10' : ''}`}
            title={isAlphabeticalSort ? 'Drag disabled in alphabetical mode' : 'Drag to reorder or move to different category'}
            disabled={isAlphabeticalSort}
            {...attributes}
            {...listeners}
          >
            <GripVertical className={`h-3.5 w-3.5 ${
              isAlphabeticalSort 
                ? 'text-muted-foreground/30' 
                : !isDragging 
                  ? 'text-muted-foreground' 
                  : 'text-primary animate-pulse'
            }`} />
          </Button>
        </div>
      </div>

      {/* Alphabetical Sort Disabled Overlay */}
      <DisabledOverlay 
        isVisible={isAlphabeticalSort} 
        message="Drag disabled" 
        size="sm"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteSubcategoryDialog
        subcategory={subcategory}
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}