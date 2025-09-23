import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  Active,
  Over,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useSortingPreference } from '../../../../hooks/useSortingPreference.js'
import type { CategoryWithSubcategories } from '../../../../types/menu-editor.js'

interface DragDropProviderProps {
  children: ReactNode
  categories: CategoryWithSubcategories[]
  onCategoryReorder: (categoryId: string, newOrder: number) => void
  onSubcategoryReorder: (subcategoryId: string, newOrder: number, newParentId?: string) => void
}

interface DragData {
  type: 'category' | 'subcategory'
  id: string
  parentId?: string
  name: string
}

/**
 * Provider component that wraps the menu structure with drag and drop functionality
 * Handles drag start, drag over, and drag end events for categories and subcategories
 * Conditionally disables drag and drop when alphabetical sorting is active
 */
export function DragDropProvider({
  children,
  categories,
  onCategoryReorder,
  onSubcategoryReorder,
}: DragDropProviderProps) {
  const { isAlphabeticalSort } = useSortingPreference()
  const [activeItem, setActiveItem] = useState<DragData | null>(null)

  // Configure sensors for different input methods
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Require 10px of movement before drag starts to prevent accidental drags
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay for touch devices
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  /**
   * Extract drag data from active/over items
   */
  const extractDragData = (item: Active | Over | null): DragData | null => {
    if (!item?.data?.current) return null
    
    const data = item.data.current as DragData
    return {
      type: data.type,
      id: data.id,
      parentId: data.parentId,
      name: data.name,
    }
  }

  /**
   * Handle drag start - store the active item for overlay display
   */
  const handleDragStart = (event: DragStartEvent) => {
    // Don't allow drag start if alphabetical sorting is active
    if (isAlphabeticalSort) {
      return
    }

    const dragData = extractDragData(event.active)
    if (dragData) {
      setActiveItem(dragData)
    }
  }

  /**
   * Handle drag over - provide visual feedback during drag
   */
  const handleDragOver = (event: DragOverEvent) => {
    // Don't process drag over if alphabetical sorting is active
    if (isAlphabeticalSort) {
      return
    }

    const { active, over } = event
    
    if (!active || !over) return

    const activeData = extractDragData(active)
    const overData = extractDragData(over)

    if (!activeData || !overData) return

    // Add visual feedback for valid drop zones
    if (activeData.type === 'subcategory' && overData.type === 'category') {
      // Subcategory being dragged over a category - valid drop zone
      console.log('🎯 Valid drop zone: Subcategory over category:', {
        subcategory: activeData.name,
        targetCategory: overData.name,
      })
    } else if (activeData.type === 'category' && overData.type === 'category') {
      // Category being dragged over another category - valid reorder
      console.log('🔄 Valid reorder: Category over category:', {
        active: activeData.name,
        over: overData.name,
      })
    } else if (activeData.type === 'subcategory' && overData.type === 'subcategory') {
      // Subcategory being dragged over another subcategory - valid reorder/move
      console.log('📝 Valid subcategory operation:', {
        active: activeData.name,
        over: overData.name,
      })
    }
  }

  /**
   * Handle drag end - perform the actual reordering
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    // Clear active item
    setActiveItem(null)

    // Don't process drag end if alphabetical sorting is active
    if (isAlphabeticalSort) {
      return
    }

    if (!active || !over) return

    const activeData = extractDragData(active)
    const overData = extractDragData(over)

    if (!activeData || !overData) return

    // Don't do anything if dropped on itself
    if (activeData.id === overData.id) return

    // Handle category reordering
    if (activeData.type === 'category' && overData.type === 'category') {
      handleCategoryReorder(activeData.id, overData.id)
    }
    
    // Handle subcategory reordering
    else if (activeData.type === 'subcategory') {
      handleSubcategoryReorder(activeData, overData)
    }
  }

  /**
   * Calculate new order for category reordering
   */
  const handleCategoryReorder = (activeCategoryId: string, overCategoryId: string) => {
    const activeIndex = categories.findIndex(cat => cat.id === activeCategoryId)
    const overIndex = categories.findIndex(cat => cat.id === overCategoryId)

    if (activeIndex === -1 || overIndex === -1) return

    // Don't reorder if dropping on itself
    if (activeIndex === overIndex) return

    // Calculate new sort order based on position
    let newOrder: number

    // Determine if we're moving up or down
    const movingDown = activeIndex < overIndex

    if (movingDown) {
      // Moving down: place after the target item
      if (overIndex === categories.length - 1) {
        // Moving to last position
        newOrder = categories[overIndex].sortOrder + 1000
      } else {
        // Moving to middle position - place between target and next item
        const targetOrder = categories[overIndex].sortOrder
        const nextOrder = categories[overIndex + 1].sortOrder
        
        // Ensure we have enough space between orders
        if (nextOrder - targetOrder <= 1) {
          newOrder = targetOrder + 500
        } else {
          newOrder = (targetOrder + nextOrder) / 2
        }
      }
    } else {
      // Moving up: place before the target item
      if (overIndex === 0) {
        // Moving to first position
        newOrder = Math.max(0, categories[overIndex].sortOrder - 1000)
      } else {
        // Moving to middle position - place between previous and target item
        const prevOrder = categories[overIndex - 1].sortOrder
        const targetOrder = categories[overIndex].sortOrder
        
        // Ensure we have enough space between orders
        if (targetOrder - prevOrder <= 1) {
          newOrder = prevOrder + 500
        } else {
          newOrder = (prevOrder + targetOrder) / 2
        }
      }
    }

    // Ensure the new order is a valid number
    if (isNaN(newOrder) || !isFinite(newOrder)) {
      console.error('Invalid sort order calculated:', newOrder)
      return
    }

    onCategoryReorder(activeCategoryId, newOrder)
  }

  /**
   * Handle subcategory reordering (within same category or cross-category)
   */
  const handleSubcategoryReorder = (activeData: DragData, overData: DragData) => {
    // Find the active subcategory and its current parent
    let activeSubcategory: any = null
    let activeParentId: string | undefined

    for (const category of categories) {
      const subcategory = category.children?.find(sub => sub.id === activeData.id)
      if (subcategory) {
        activeSubcategory = subcategory
        activeParentId = category.id
        break
      }
    }

    if (!activeSubcategory || !activeParentId) {
      console.error('Active subcategory not found:', activeData.id)
      return
    }

    // If dropping on a category, move subcategory to that category
    if (overData.type === 'category') {
      const targetCategory = categories.find(cat => cat.id === overData.id)
      if (!targetCategory) {
        console.error('Target category not found:', overData.id)
        return
      }

      // Don't move if dropping on the same category
      if (activeParentId === overData.id) {
        return
      }

      // Calculate new order (append to end of target category)
      const maxOrder = targetCategory.children?.reduce(
        (max, sub) => Math.max(max, sub.sortOrder), 
        0
      ) || 0
      
      console.log('📁 Moving subcategory to category:', {
        subcategoryId: activeData.id,
        subcategoryName: activeData.name,
        fromCategory: activeParentId,
        toCategory: overData.id,
        newOrder: maxOrder + 1000
      })
      
      onSubcategoryReorder(activeData.id, maxOrder + 1000, overData.id)
    }
    
    // If dropping on another subcategory
    else if (overData.type === 'subcategory') {
      // Find the target subcategory and its parent
      let targetParentId: string | undefined
      let targetSubcategory: any = null
      let targetIndex = -1

      for (const category of categories) {
        const subcategoryIndex = category.children?.findIndex(sub => sub.id === overData.id) ?? -1
        if (subcategoryIndex >= 0) {
          targetParentId = category.id
          targetSubcategory = category.children![subcategoryIndex]
          targetIndex = subcategoryIndex
          break
        }
      }

      if (!targetSubcategory || !targetParentId || targetIndex === -1) {
        console.error('Target subcategory not found:', overData.id)
        return
      }

      // Don't drop on itself
      if (activeData.id === overData.id) {
        return
      }

      // Calculate new order based on position
      let newOrder: number

      if (activeParentId === targetParentId) {
        // Moving within the same category - reorder
        const siblings = categories.find(cat => cat.id === targetParentId)?.children || []
        const activeIndex = siblings.findIndex(sub => sub.id === activeData.id)
        
        if (activeIndex === -1) return

        // Don't reorder if dropping in the same position
        if (Math.abs(activeIndex - targetIndex) <= 1) {
          return
        }

        // Determine if we're moving up or down
        const movingDown = activeIndex < targetIndex

        if (movingDown) {
          // Moving down: place after the target item
          if (targetIndex === siblings.length - 1) {
            // Moving to last position
            newOrder = targetSubcategory.sortOrder + 1000
          } else {
            // Moving to middle position - place between target and next item
            const nextSubcategory = siblings[targetIndex + 1]
            const targetOrder = targetSubcategory.sortOrder
            const nextOrder = nextSubcategory.sortOrder
            
            // Ensure we have enough space between orders
            if (nextOrder - targetOrder <= 1) {
              newOrder = targetOrder + 500
            } else {
              newOrder = (targetOrder + nextOrder) / 2
            }
          }
        } else {
          // Moving up: place before the target item
          if (targetIndex === 0) {
            // Moving to first position
            newOrder = Math.max(0, targetSubcategory.sortOrder - 1000)
          } else {
            // Moving to middle position - place between previous and target item
            const prevSubcategory = siblings[targetIndex - 1]
            const prevOrder = prevSubcategory.sortOrder
            const targetOrder = targetSubcategory.sortOrder
            
            // Ensure we have enough space between orders
            if (targetOrder - prevOrder <= 1) {
              newOrder = prevOrder + 500
            } else {
              newOrder = (prevOrder + targetOrder) / 2
            }
          }
        }

        console.log('✅ Reordering subcategory within category:', {
          subcategoryId: activeData.id,
          subcategoryName: activeData.name,
          categoryId: targetParentId,
          oldOrder: activeSubcategory.sortOrder,
          newOrder,
          activeIndex,
          targetIndex
        })

        onSubcategoryReorder(activeData.id, newOrder)
      } else {
        // Moving to different category - place before the target subcategory
        if (targetIndex === 0) {
          // Moving to first position in target category
          newOrder = Math.max(0, targetSubcategory.sortOrder - 1000)
        } else {
          // Moving to middle position - place between previous and target item
          const targetSiblings = categories.find(cat => cat.id === targetParentId)?.children || []
          const prevSubcategory = targetSiblings[targetIndex - 1]
          const prevOrder = prevSubcategory.sortOrder
          const targetOrder = targetSubcategory.sortOrder
          
          // Ensure we have enough space between orders
          if (targetOrder - prevOrder <= 1) {
            newOrder = prevOrder + 500
          } else {
            newOrder = (prevOrder + targetOrder) / 2
          }
        }

        console.log('🔄 Moving subcategory to different category:', {
          subcategoryId: activeData.id,
          subcategoryName: activeData.name,
          fromCategory: activeParentId,
          toCategory: targetParentId,
          newOrder,
          targetIndex
        })

        onSubcategoryReorder(activeData.id, newOrder, targetParentId)
      }
    }
  }

  /**
   * Render enhanced drag overlay with item preview
   */
  const renderDragOverlay = () => {
    if (!activeItem) return null

    // Find the full item data for enhanced preview
    let itemData: any = null
    let itemCount = 0

    if (activeItem.type === 'category') {
      itemData = categories.find(cat => cat.id === activeItem.id)
      if (itemData) {
        itemCount = itemData._count.menuItems + 
          (itemData.children?.reduce((sum: number, sub: any) => sum + sub._count.menuItems, 0) || 0)
      }
    } else {
      // Find subcategory
      for (const category of categories) {
        const subcategory = category.children?.find(sub => sub.id === activeItem.id)
        if (subcategory) {
          itemData = subcategory
          itemCount = subcategory._count.menuItems
          break
        }
      }
    }

    return (
      <div className="bg-card border-2 border-primary/50 rounded-lg shadow-2xl p-3 opacity-95 drag-overlay">
        <div className="flex items-center gap-3">
          {/* Drag indicator */}
          <div className="flex flex-col gap-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>

          {/* Item info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{activeItem.name}</span>
            </div>
          </div>

          {/* Moving indicator */}
          <div className="flex items-center gap-1 text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
            <span className="text-xs font-medium">Moving</span>
          </div>
        </div>
      </div>
    )
  }

  // If alphabetical sorting is active, render children without drag context
  if (isAlphabeticalSort) {
    return <>{children}</>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {renderDragOverlay()}
      </DragOverlay>
    </DndContext>
  )
}