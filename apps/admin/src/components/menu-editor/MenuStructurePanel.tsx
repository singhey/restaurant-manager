import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog'
import { Plus, Loader2 } from 'lucide-react'
import { useCategoryData } from '../../hooks/useCategoryData'
import { useCategoryExpandedState } from '../../hooks/useCategoryState'
import { CategoryItem } from './CategoryItem'
import { AddCategoryForm } from './AddCategoryForm'
import type { MenuStructurePanelProps, CreateCategoryData } from '../../types/menu-editor'

/**
 * Left panel component containing the hierarchical menu structure
 * Displays categories and subcategories with add/delete functionality
 */
export function MenuStructurePanel({ onItemSelect: _onItemSelect }: MenuStructurePanelProps) {
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  
  // TODO: Get restaurantId from auth context
  const restaurantId = 'placeholder-restaurant-id'
  
  const {
    categories,
    isLoading,
    error,
    hasCategories,
    totalCategories,
    totalSubcategories,
  } = useCategoryData(restaurantId)

  const {
    isExpanded,
    toggleExpanded,
    expandAll,
    collapseAll,
  } = useCategoryExpandedState()

  const handleAddCategory = () => {
    setShowAddCategoryForm(true)
  }

  const handleCancelAddCategory = () => {
    setShowAddCategoryForm(false)
  }

  const handleCategorySubmit = (_data: CreateCategoryData) => {
    // Form handles the creation, just close the dialog
    setShowAddCategoryForm(false)
  }

  const handleCategoryDelete = (categoryId: string) => {
    // TODO: Implement category deletion in future task
    console.log('Delete category:', categoryId)
  }

  const handleCategoryReorder = (categoryId: string, newOrder: number) => {
    // TODO: Implement category reordering in future task
    console.log('Reorder category:', categoryId, newOrder)
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center text-destructive">
          <p className="font-medium mb-2">Failed to load categories</p>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Menu Structure</h2>
          {hasCategories && (
            <p className="text-sm text-muted-foreground">
              {totalCategories} categories, {totalSubcategories} subcategories
            </p>
          )}
        </div>
        
        {/* Expand/Collapse Controls */}
        {hasCategories && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => expandAll(categories.map(cat => cat.id))}
              className="text-xs"
            >
              Expand All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={collapseAll}
              className="text-xs"
            >
              Collapse All
            </Button>
          </div>
        )}
      </div>

      {/* Add Category Button */}
      <div className="mb-4">
        <Button
          onClick={handleAddCategory}
          disabled={showAddCategoryForm || isLoading}
          className="w-full"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategoryForm} onOpenChange={setShowAddCategoryForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <AddCategoryForm
            onSubmit={handleCategorySubmit}
            onCancel={handleCancelAddCategory}
          />
        </DialogContent>
      </Dialog>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-muted-foreground">Loading categories...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !hasCategories && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No categories found</p>
            <p className="text-sm text-muted-foreground">
              Create your first category to get started
            </p>
          </div>
        </div>
      )}

      {/* Category List */}
      {!isLoading && hasCategories && (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                isExpanded={isExpanded(category.id)}
                onToggleExpanded={toggleExpanded}
                onDelete={handleCategoryDelete}
                onReorder={handleCategoryReorder}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}