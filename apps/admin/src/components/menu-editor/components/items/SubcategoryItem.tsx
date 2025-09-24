import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Trash2, GripVertical, ChevronRight, Plus } from 'lucide-react'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DeleteSubcategoryDialog } from '../dialogs/DeleteSubcategoryDialog'
import { DisabledOverlay } from '../ui/DisabledOverlay'
import { MenuItemRow } from './MenuItemRow'
import { useSortingPreference } from '@/hooks/useSortingPreference'
import type { SubcategoryItemProps } from '@/types/menu-editor'

/**
 * Component for displaying individual subcategories within expanded categories
 * Shows subcategory name, item count, and delete functionality
 */
export function SubcategoryItem({
  subcategory,
  isExpanded,
  onToggleExpanded,
  onDelete: _onDelete,
  onReorder: _onReorder,
  onMenuItemSelect,
  onMenuItemAdd,
  isLoadingMenuItems = false,
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

  const handleToggleExpanded = () => {
    onToggleExpanded(subcategory.id)
  }

  const handleAddMenuItem = () => {
    onMenuItemAdd(subcategory.id)
  }

  const handleMenuItemSelect = (menuItem: any) => {
    onMenuItemSelect(menuItem)
  }

  const handleMenuItemDelete = (menuItemId: string) => {
    // This will be handled by the MenuItemRow component's delete dialog
    console.log('Menu item deletion initiated:', menuItemId)
  }

  const handleMenuItemToggleActive = (menuItemId: string, isActive: boolean) => {
    // This will be handled by the parent component
    console.log('Menu item toggle active:', menuItemId, isActive)
  }

  const handleMenuItemReorder = (menuItemId: string, newOrder: number) => {
    // This will be handled by the parent component
    console.log('Menu item reorder:', menuItemId, newOrder)
  }

  const hasMenuItems = subcategory.menuItems && subcategory.menuItems.length > 0

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
      <div className={`group flex items-center gap-2 p-2 transition-all duration-200 ${
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

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleExpanded}
          className="h-6 w-6 p-0 hover:bg-muted"
          disabled={!hasMenuItems}
          title={hasMenuItems ? (isExpanded ? 'Collapse menu items' : 'Expand menu items') : 'No menu items'}
        >
          <ChevronRight
            className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''
              } ${!hasMenuItems ? 'opacity-30' : ''}`}
          />
        </Button>

        {/* Subcategory Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{subcategory.name}</h4>
            <span className="text-xs text-muted-foreground">
              ({subcategory._count.menuItems} items)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Add Menu Item Button - More prominent on hover */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddMenuItem}
            className="h-6 w-6 p-0 opacity-60 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all duration-200"
            title="Add Menu Item"
          >
            <Plus className="h-3 w-3" />
          </Button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
            title="Delete Subcategory"
          >
            <Trash2 className="h-3 w-3" />
          </Button>

          {/* Drag Handle */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 drag-handle ${
              isAlphabeticalSort 
                ? '' 
                : 'cursor-grab active:cursor-grabbing hover:bg-primary/10 hover:text-primary'
            } ${isDragging ? 'cursor-grabbing bg-primary/10' : ''}`}
            title={isAlphabeticalSort ? 'Drag disabled in alphabetical mode' : 'Drag to reorder or move to different category'}
            disabled={isAlphabeticalSort}
            {...attributes}
            {...listeners}
          >
            <GripVertical className={`h-3 w-3 ${
              isAlphabeticalSort 
                ? 'text-muted-foreground/30' 
                : !isDragging 
                  ? 'text-muted-foreground' 
                  : 'text-primary animate-pulse'
            }`} />
          </Button>
        </div>
      </div>

      {/* Expanded Menu Items */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/10">
          <div className="p-1 space-y-1">
            {isLoadingMenuItems ? (
              // Loading state for menu item data fetching
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="text-xs text-muted-foreground">Loading menu items...</p>
                </div>
              </div>
            ) : hasMenuItems ? (
              <SortableContext 
                items={subcategory.menuItems!.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {subcategory.menuItems!.map((menuItem) => (
                  <MenuItemRow
                    key={menuItem.id}
                    menuItem={menuItem}
                    onSelect={handleMenuItemSelect}
                    onDelete={handleMenuItemDelete}
                    onToggleActive={handleMenuItemToggleActive}
                    onReorder={handleMenuItemReorder}
                    isSelected={false} // TODO: Track selected menu item
                  />
                ))}
              </SortableContext>
            ) : (
              // Empty state when subcategory has no menu items
              <div className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">No menu items yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddMenuItem}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add First Item
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

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