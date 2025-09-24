import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Trash2, GripVertical, Eye, EyeOff } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DeleteMenuItemDialog } from '../dialogs/DeleteMenuItemDialog'
import { DisabledOverlay } from '../ui/DisabledOverlay'
import { useSortingPreference } from '@/hooks/useSortingPreference'
import type { MenuItemRowProps } from '@/types/menu-editor'

/**
 * Component for displaying individual menu items within expanded subcategories
 * Shows menu item name, price, active status, and provides editing/deletion functionality
 */
export function MenuItemRow({
  menuItem,
  onSelect,
  onDelete,
  onToggleActive,
  onReorder,
  isSelected,
}: MenuItemRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { isAlphabeticalSort } = useSortingPreference()

  // Set up drag and drop for menu items
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: menuItem.id,
    data: {
      type: 'menuItem',
      id: menuItem.id,
      subcategoryId: menuItem.categoryId,
      name: menuItem.name,
      sortOrder: menuItem.sortOrder,
    },
    disabled: isAlphabeticalSort, // Disable dragging when alphabetical sorting is active
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleClick = () => {
    onSelect(menuItem)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the row selection
    setShowDeleteDialog(true)
  }

  const handleToggleActiveClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the row selection
    onToggleActive(menuItem.id, !menuItem.isActive)
  }

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
  }

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border border-border/30 rounded bg-card/30 reorder-transition cursor-pointer ${isDragging
          ? 'menu-item-dragging'
          : 'item-hover'
        } ${isSelected
          ? 'bg-primary/10 border-primary/30'
          : ''
        } ${!menuItem.isActive
          ? 'opacity-60'
          : ''
        } ${isAlphabeticalSort
          ? 'disabled-drag'
          : ''
        }`}
      onClick={handleClick}
    >
      {/* Menu Item Content */}
      <div className={`flex items-center gap-2 p-2 transition-all duration-200 ${isDragging
          ? 'bg-primary/5'
          : ''
        } ${isAlphabeticalSort
          ? 'bg-muted/10'
          : ''
        }`}>
        {/* Double Indent Indicator for menu items */}
        <div className="w-6 flex justify-center">
          <div className="w-px h-4 bg-border/50"></div>
        </div>

        {/* Menu Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h5 className={`font-medium text-xs truncate ${!menuItem.isActive ? 'line-through text-muted-foreground' : ''
              }`}>
              {menuItem.name}
            </h5>
            <span className={`text-xs font-medium ${!menuItem.isActive ? 'line-through text-muted-foreground' : 'text-primary'
              }`}>
              {formatPrice(menuItem.price)}
            </span>
          </div>

          {/* Menu Item Description */}
          {menuItem.description && (
            <p className={`text-xs mt-1 truncate ${!menuItem.isActive ? 'line-through text-muted-foreground/70' : 'text-muted-foreground'
              }`}>
              {menuItem.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Active/Inactive Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleActiveClick}
            className={`h-6 w-6 p-0 ${menuItem.isActive
                ? 'hover:bg-orange-100 hover:text-orange-600'
                : 'hover:bg-green-100 hover:text-green-600'
              }`}
            title={menuItem.isActive ? 'Deactivate menu item' : 'Activate menu item'}
          >
            {menuItem.isActive ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
            title="Delete Menu Item"
          >
            <Trash2 className="h-3 w-3" />
          </Button>

          {/* Drag Handle */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 drag-handle ${isAlphabeticalSort
                ? ''
                : 'cursor-grab active:cursor-grabbing hover:bg-primary/10 hover:text-primary'
              } ${isDragging ? 'cursor-grabbing bg-primary/10' : ''}`}
            title={isAlphabeticalSort ? 'Drag disabled in alphabetical mode' : 'Drag to reorder within subcategory'}
            disabled={isAlphabeticalSort}
            {...attributes}
            {...listeners}
          >
            <GripVertical className={`h-3 w-3 ${isAlphabeticalSort
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
      <DeleteMenuItemDialog
        menuItem={menuItem}
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}