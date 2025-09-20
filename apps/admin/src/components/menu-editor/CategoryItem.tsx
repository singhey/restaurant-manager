import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { ChevronRight, Plus, Trash2, MoreVertical } from 'lucide-react'
import { SubcategoryItem } from './SubcategoryItem'
import { AddSubcategoryForm } from './AddSubcategoryForm'
import type { CategoryItemProps, CreateSubcategoryData } from '../../types/menu-editor'

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
}: CategoryItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAddSubcategoryForm, setShowAddSubcategoryForm] = useState(false)

  const hasSubcategories = category.children && category.children.length > 0
  const totalItems = category._count.menuItems +
    (category.children?.reduce((sum, sub) => sum + sub._count.menuItems, 0) || 0)

  const handleToggleExpanded = () => {
    onToggleExpanded(category.id)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(category.id)
    setShowDeleteConfirm(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  const handleAddSubcategory = () => {
    setShowAddSubcategoryForm(true)
  }

  const handleSubcategorySubmit = (_data: CreateSubcategoryData) => {
    // Form handles the creation, just close the form
    setShowAddSubcategoryForm(false)
  }

  const handleSubcategoryCancelAdd = () => {
    setShowAddSubcategoryForm(false)
  }

  const handleSubcategoryDelete = (subcategoryId: string) => {
    // TODO: Implement subcategory deletion in future task
    console.log('Delete subcategory:', subcategoryId)
  }

  const handleSubcategoryReorder = (subcategoryId: string, newOrder: number, newParentId?: string) => {
    // TODO: Implement subcategory reordering in future task
    console.log('Reorder subcategory:', subcategoryId, newOrder, newParentId)
  }

  return (
    <div className="border border-border rounded-lg bg-card">
      {/* Category Header */}
      <div className="flex items-center gap-2 p-3">
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

            {/* Item Count Badge */}
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
              {totalItems} items
            </span>

            {/* Subcategory Count Badge */}
            {hasSubcategories && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                {category._count.children} subcategories
              </span>
            )}
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
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            title="Delete Category"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* More Options (Future: Drag Handle) */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted cursor-grab"
            title="Drag to reorder"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="border-t border-border bg-destructive/5 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">Delete Category?</p>
              <p className="text-xs text-muted-foreground">
                This will delete all subcategories and {totalItems} items
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDeleteCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Form */}
      {showAddSubcategoryForm && (
        <div className="border-t border-border bg-muted/30 p-3">
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
            {category.children!.map((subcategory) => (
              <SubcategoryItem
                key={subcategory.id}
                subcategory={subcategory}
                onDelete={handleSubcategoryDelete}
                onReorder={handleSubcategoryReorder}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}