import { useState } from 'react'
import type { SubcategoryExpansionState } from '@/types/menu-editor'

/**
 * Hook for managing subcategory expansion state with localStorage persistence
 * Tracks which subcategories are expanded/collapsed and persists preferences
 */
export function useSubcategoryExpansion(): SubcategoryExpansionState {
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('menu-editor-expanded-subcategories')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.warn('Failed to load expanded subcategories from localStorage:', error)
      return []
    }
  })

  const toggleSubcategoryExpanded = (subcategoryId: string) => {
    setExpandedSubcategories(prev => {
      const newExpanded = prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
      
      try {
        localStorage.setItem('menu-editor-expanded-subcategories', JSON.stringify(newExpanded))
      } catch (error) {
        console.warn('Failed to save expanded subcategories to localStorage:', error)
      }
      
      return newExpanded
    })
  }

  const isSubcategoryExpanded = (subcategoryId: string) => {
    return expandedSubcategories.includes(subcategoryId)
  }

  return {
    expandedSubcategories,
    toggleSubcategoryExpanded,
    isSubcategoryExpanded
  }
}