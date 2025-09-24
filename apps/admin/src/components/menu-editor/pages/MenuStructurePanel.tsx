import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog'
import { Plus, Loader2 } from 'lucide-react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { toast } from 'sonner'
import { useCategoryData } from '../../../hooks/useCategoryData'
import { useCategoryExpandedState } from '../../../hooks/useCategoryState'
import { useFindManyCategory, useUpdateCategory } from '@workspace/db/hooks/trpc/category'
import { useUpdateMenuItem } from '@workspace/db/hooks/trpc/menu-item'
import { CategoryItem } from '../components/items/CategoryItem'
import { AddCategoryForm } from '../components/forms/AddCategoryForm'
import { DeleteCategoryDialog } from '../components/dialogs/DeleteCategoryDialog'
import { DragDropProvider } from '../components/providers/DragDropProvider'
import { LoadingOverlay } from '../components/ui/LoadingOverlay'
import type { MenuStructurePanelProps, CreateCategoryData, CategoryWithSubcategories } from '../../../types/menu-editor'
import { useParams } from '@tanstack/react-router'

/**
 * Left panel component containing the hierarchical menu structure
 * Displays categories and subcategories with add/delete functionality
 */

export function MenuStructurePanel({}: MenuStructurePanelProps) {
  const {restaurantId} = useParams({strict: false})
  const {data: categories} = useFindManyCategory({
    where: {
      restaurantId,
    }
  })

  return <div>

  </div>
}

export function MenuStructurePanels({ onItemSelect: _onItemSelect }: MenuStructurePanelProps) {
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithSubcategories | null>(null)
  
  // TODO: Get restaurantId from auth context
  const {restaurantId} = useParams({strict: false})
  
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

  const handleCategorySubmit = (data: CreateCategoryData) => {
    // Form handles the creation, just close the dialog
    console.log('Category created:', data)
    setShowAddCategoryForm(false)
  }

  const handleCategoryDelete = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (category) {
      setCategoryToDelete(category)
    }
  }

  const handleDeleteDialogClose = () => {
    setCategoryToDelete(null)
  }

  const handleDeleteSuccess = () => {
    // The query will automatically refetch due to ZenStack's optimistic updates
    // No additional action needed here
  }

  // Set up category update mutation for reordering
  const { mutate: updateCategory, isPending: isUpdatingCategory } = useUpdateCategory({
    onSuccess: () => {
      toast.success('Category order updated successfully')
    },
    onError: (error: any) => {
      console.error('Failed to update category order:', error)
      toast.error('Failed to update category order. Please try again.')
    }
  })

  // Set up menu item update mutation for reordering
  const { mutate: updateMenuItem, isPending: isUpdatingMenuItem } = useUpdateMenuItem({
    onSuccess: () => {
      toast.success('Menu item order updated successfully')
    },
    onError: (error: any) => {
      console.error('Failed to update menu item order:', error)
      toast.error('Failed to update menu item order. Please try again.')
    }
  })

  const handleCategoryReorder = (categoryId: string, newOrder: number) => {
    // Validate inputs
    if (!categoryId || typeof newOrder !== 'number' || isNaN(newOrder)) {
      console.error('Invalid category reorder parameters:', { categoryId, newOrder })
      toast.error('Invalid reorder parameters')
      return
    }

    // Find the category to ensure it exists
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) {
      console.error('Category not found for reordering:', categoryId)
      toast.error('Category not found')
      return
    }

    // Don't update if the order hasn't changed
    if (category.sortOrder === newOrder) {
      return
    }

    // Log the reorder operation for debugging
    console.log('Reordering category:', {
      categoryId,
      categoryName: category.name,
      oldOrder: category.sortOrder,
      newOrder
    })

    // Update the category's sortOrder
    updateCategory({
      where: { id: categoryId },
      data: { sortOrder: newOrder }
    })
  }

  const handleSubcategoryReorder = (subcategoryId: string, newOrder: number, newParentId?: string) => {
    // Validate inputs
    if (!subcategoryId || typeof newOrder !== 'number' || isNaN(newOrder)) {
      console.error('Invalid subcategory reorder parameters:', { subcategoryId, newOrder, newParentId })
      toast.error('Invalid reorder parameters')
      return
    }

    // Find the subcategory to ensure it exists
    let subcategory = null
    let currentParentId = null
    
    for (const category of categories) {
      const found = category.children?.find(sub => sub.id === subcategoryId)
      if (found) {
        subcategory = found
        currentParentId = category.id
        break
      }
    }

    if (!subcategory) {
      console.error('Subcategory not found for reordering:', subcategoryId)
      toast.error('Subcategory not found')
      return
    }

    // Determine if this is a cross-category move or same-category reorder
    const isMovingToNewCategory = newParentId && newParentId !== currentParentId
    
    // Don't update if nothing has changed
    if (!isMovingToNewCategory && subcategory.sortOrder === newOrder) {
      return
    }

    // Log the reorder operation for debugging
    console.log('🎯 MenuStructurePanel: Reordering subcategory:', {
      subcategoryId,
      subcategoryName: subcategory.name,
      oldOrder: subcategory.sortOrder,
      newOrder,
      oldParentId: currentParentId,
      newParentId: newParentId || currentParentId,
      isMovingToNewCategory
    })

    // Prepare update data
    const updateData: { sortOrder: number; parentId?: string } = {
      sortOrder: newOrder
    }

    // If moving to a new category, update the parentId
    if (isMovingToNewCategory) {
      updateData.parentId = newParentId
    }

    // Update the subcategory
    updateCategory({
      where: { id: subcategoryId },
      data: updateData
    })
  }

  const handleMenuItemReorder = (menuItemId: string, newOrder: number) => {
    // Validate inputs
    if (!menuItemId || typeof newOrder !== 'number' || isNaN(newOrder)) {
      console.error('Invalid menu item reorder parameters:', { menuItemId, newOrder })
      toast.error('Invalid reorder parameters')
      return
    }

    // Find the menu item to ensure it exists
    let menuItem = null
    
    for (const category of categories) {
      for (const subcategory of category.children || []) {
        const found = subcategory.menuItems?.find((item: any) => item.id === menuItemId)
        if (found) {
          menuItem = found
          break
        }
      }
      if (menuItem) break
    }

    if (!menuItem) {
      console.error('Menu item not found for reordering:', menuItemId)
      toast.error('Menu item not found')
      return
    }

    // Don't update if the order hasn't changed
    if (menuItem.sortOrder === newOrder) {
      return
    }

    // Log the reorder operation for debugging
    console.log('🍽️ MenuStructurePanel: Reordering menu item:', {
      menuItemId,
      menuItemName: menuItem.name,
      oldOrder: menuItem.sortOrder,
      newOrder
    })

    // Update the menu item's sortOrder
    updateMenuItem({
      where: { id: menuItemId },
      data: { sortOrder: newOrder }
    })
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <AddCategoryForm
            onSubmit={handleCategorySubmit}
            onCancel={handleCancelAddCategory}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <DeleteCategoryDialog
        category={categoryToDelete}
        isOpen={categoryToDelete !== null}
        onClose={handleDeleteDialogClose}
        onSuccess={handleDeleteSuccess}
      />

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
        <div className="flex-1 overflow-y-auto relative">
          <DragDropProvider
            categories={categories}
            onCategoryReorder={handleCategoryReorder}
            onSubcategoryReorder={handleSubcategoryReorder}
            onMenuItemReorder={handleMenuItemReorder}
          >
            <SortableContext 
              items={categories.map(cat => cat.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className={`space-y-2 ${isUpdatingCategory || isUpdatingMenuItem ? 'loading-blur' : ''}`}>
                {categories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    isExpanded={isExpanded(category.id)}
                    onToggleExpanded={toggleExpanded}
                    onDelete={handleCategoryDelete}
                    onReorder={handleCategoryReorder}
                    onSubcategoryReorder={handleSubcategoryReorder}
                    onMenuItemSelect={(menuItem) => {
                      console.log('Menu item selected:', menuItem)
                      // TODO: Integrate with right panel state management
                    }}
                    onMenuItemAdd={(subcategoryId) => {
                      console.log('Add menu item to subcategory:', subcategoryId)
                      // TODO: Integrate with right panel state management
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DragDropProvider>
          
          {/* Enhanced loading overlay for reordering */}
          <LoadingOverlay 
            isVisible={isUpdatingCategory || isUpdatingMenuItem}
            title="Updating order..."
            subtitle="Please wait"
          />
        </div>
      )}
    </div>
  )
}