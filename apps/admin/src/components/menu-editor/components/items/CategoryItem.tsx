import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { SubcategoryItem } from './SubcategoryItem'
import { AddSubcategoryForm } from '../forms/AddSubcategoryForm'
import { DropZoneIndicator } from '../ui/DropZoneIndicator'
import { DisabledOverlay } from '../ui/DisabledOverlay'
import { useSortingPreference } from '@/hooks/useSortingPreference'
import type { CategoryItemProps, CreateSubcategoryData } from '@/types/menu-editor'

/**
 * Component for displaying individual categories with expandable subcategories
 * Includes toggle functionality, item counts, and delete confirmation
 */
export function CategoryItem({
  category,
  isExpanded,
  onToggleExpanded,
  onDelete,
  onReorder: _onReorder,
  onSubcategoryReorder,
}: CategoryItemProps) {
  const [showAddSubcategoryForm, setShowAddSubcategoryForm] = useState(false)
  const { isAlphabeticalSort } = useSortingPreference()

  // Set up drag and drop for categories
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
    data: {
      type: 'category',
      id: category.id,
      name: category.name,
      sortOrder: category.sortOrder,
    },
    disabled: isAlphabeticalSort, // Disable dragging when alphabetical sorting is active
  })

  // Set up drop zone for subcategories (only when not in alphabetical sort mode)
  const {
    setNodeRef: setDroppableNodeRef,
    isOver: isDroppableOver,
  } = useDroppable({
    id: `category-drop-${category.id}`,
    data: {
      type: 'category',
      id: category.id,
      name: category.name,
      accepts: ['subcategory'],
    },
    disabled: isAlphabeticalSort,
  })

  // Combine refs for both sortable and droppable
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableNodeRef(node)
    setDroppableNodeRef(node)
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const hasSubcategories = category.children && category.children.length > 0
  const totalItems = category._count.menuItems +
    (category.children?.reduce((sum, sub) => sum + sub._count.menuItems, 0) || 0)

  const handleToggleExpanded = () => {
    onToggleExpanded(category.id)
  }

  const handleDeleteClick = () => {
    onDelete(category.id)
  }

  const handleAddSubcategory = () => {
    setShowAddSubcategoryForm(true)
  }

  const handleSubcategorySubmit = (data: CreateSubcategoryData) => {
    // Form handles the creation, just close the form
    console.log('Subcategory created:', data)
    setShowAddSubcategoryForm(false)
  }

  const handleSubcategoryCancelAdd = () => {
    setShowAddSubcategoryForm(false)
  }

  const handleSubcategoryDelete = (subcategoryId: string) => {
    // The SubcategoryItem component now handles deletion via DeleteSubcategoryDialog
    // This function is kept for interface compatibility but the actual deletion
    // is handled by the useDeleteCategory hook in the dialog component
    console.log('Subcategory deletion initiated:', subcategoryId)
  }

  const handleSubcategoryReorder = (subcategoryId: string, newOrder: number, newParentId?: string) => {
    // Pass through to parent handler
    onSubcategoryReorder(subcategoryId, newOrder, newParentId)
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`relative border border-border rounded-lg bg-card reorder-transition ${
        isDragging 
          ? 'category-dragging' 
          : 'item-hover'
      } ${
        isDroppableOver && !isAlphabeticalSort
          ? 'drop-zone-active'
          : ''
      } ${
        isAlphabeticalSort
          ? 'disabled-drag'
          : ''
      }`}
    >
      {/* Category Header */}
      <div className={`flex items-center gap-2 p-3 transition-all duration-300 ${
        isDroppableOver && !isAlphabeticalSort
          ? 'bg-primary/10 border-b border-primary/20'
          : ''
      } ${
        isDragging
          ? 'bg-primary/5'
          : ''
      } ${
        isAlphabeticalSort
          ? 'bg-muted/30'
          : ''
      }`}>
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleExpanded}
          className="h-6 w-6 p-0 hover:bg-muted"
          disabled={!hasSubcategories}
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''
              } ${!hasSubcategories ? 'opacity-30' : ''}`}
          />
        </Button>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">{category.name}</h3>
          </div>

          {/* Category Description */}
          {category.description && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {category.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Add Subcategory Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddSubcategory}
            disabled={showAddSubcategoryForm}
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Add Subcategory"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            disabled={showAddSubcategoryForm}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            title="Delete Category"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Drag Handle */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 drag-handle ${
              isAlphabeticalSort 
                ? '' 
                : 'cursor-grab active:cursor-grabbing hover:bg-primary/10 hover:text-primary'
            } ${isDragging ? 'cursor-grabbing bg-primary/10' : ''}`}
            title={isAlphabeticalSort ? 'Drag disabled in alphabetical mode' : 'Drag to reorder'}
            disabled={isAlphabeticalSort}
            {...attributes}
            {...listeners}
          >
            <GripVertical className={`h-4 w-4 ${
              isAlphabeticalSort 
                ? 'text-muted-foreground/30' 
                : !isDragging 
                  ? 'text-muted-foreground' 
                  : 'text-primary'
            }`} />
          </Button>
        </div>

        {/* Enhanced Drop Zone Indicator */}
        <DropZoneIndicator isActive={isDroppableOver && !isAlphabeticalSort}>
          Drop subcategory here
        </DropZoneIndicator>

        {/* Alphabetical Sort Disabled Overlay */}
        <DisabledOverlay 
          isVisible={isAlphabeticalSort} 
          message="Drag disabled (A-Z mode)" 
          size="md"
          className="rounded-lg"
        />
      </div>

      {/* Add Subcategory Form */}
      {showAddSubcategoryForm && (
        <div className="border-t border-border bg-muted/30 p-3">
          <div className="mb-2">
            <h4 className="text-sm font-medium text-foreground">Add Subcategory to "{category.name}"</h4>
          </div>
          <AddSubcategoryForm
            parentCategoryId={category.id}
            onSubmit={handleSubcategorySubmit}
            onCancel={handleSubcategoryCancelAdd}
          />
        </div>
      )}

      {/* Expanded Subcategories */}
      {isExpanded && hasSubcategories && (
        <div className="border-t border-border bg-muted/20">
          <div className="p-2 space-y-1">
            <SortableContext 
              items={category.children!.map(sub => sub.id)}
              strategy={verticalListSortingStrategy}
            >
              {category.children!.map((subcategory) => (
                <SubcategoryItem
                  key={subcategory.id}
                  subcategory={subcategory}
                  onDelete={handleSubcategoryDelete}
                  onReorder={handleSubcategoryReorder}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      )}
    </div>
  )
}