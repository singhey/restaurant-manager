import { useState, useCallback, useEffect } from 'react';
import type { ExpandedStatesStorage } from '../types/menu-editor';

const EXPANDED_STATES_KEY = 'menu-editor-expanded-categories';

/**
 * Hook for managing category expand/collapse state with localStorage persistence
 */
export function useCategoryExpandedState() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    // Initialize from localStorage
    try {
      const stored = localStorage.getItem(EXPANDED_STATES_KEY);
      if (stored) {
        const parsedStates: ExpandedStatesStorage = JSON.parse(stored);
        return new Set(
          Object.entries(parsedStates)
            .filter(([, isExpanded]) => isExpanded)
            .map(([categoryId]) => categoryId)
        );
      }
    } catch (error) {
      console.warn('Failed to load expanded states from localStorage:', error);
    }
    return new Set<string>();
  });

  // Persist to localStorage whenever expanded state changes
  useEffect(() => {
    try {
      const statesObject: ExpandedStatesStorage = {};
      expandedCategories.forEach(categoryId => {
        statesObject[categoryId] = true;
      });
      localStorage.setItem(EXPANDED_STATES_KEY, JSON.stringify(statesObject));
    } catch (error) {
      console.warn('Failed to save expanded states to localStorage:', error);
    }
  }, [expandedCategories]);

  const toggleExpanded = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const setExpanded = useCallback((categoryId: string, isExpanded: boolean) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(categoryId);
      } else {
        newSet.delete(categoryId);
      }
      return newSet;
    });
  }, []);

  const expandAll = useCallback((categoryIds: string[]) => {
    setExpandedCategories(new Set(categoryIds));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  const isExpanded = useCallback((categoryId: string) => {
    return expandedCategories.has(categoryId);
  }, [expandedCategories]);

  return {
    expandedCategories,
    isExpanded,
    toggleExpanded,
    setExpanded,
    expandAll,
    collapseAll,
  };
}

/**
 * Utility functions for category tree operations
 */
export const categoryTreeUtils = {
  /**
   * Find a category by ID in the category tree
   */
  findCategoryById: (categories: any[], categoryId: string): any | null => {
    for (const category of categories) {
      if (category.id === categoryId) {
        return category;
      }
      if (category.children) {
        const found = categoryTreeUtils.findCategoryById(category.children, categoryId);
        if (found) return found;
      }
    }
    return null;
  },

  /**
   * Get all category IDs in a flat array
   */
  getAllCategoryIds: (categories: any[]): string[] => {
    const ids: string[] = [];
    const traverse = (cats: any[]) => {
      cats.forEach(cat => {
        ids.push(cat.id);
        if (cat.children) {
          traverse(cat.children);
        }
      });
    };
    traverse(categories);
    return ids;
  },

  /**
   * Get parent category for a given subcategory ID
   */
  getParentCategory: (categories: any[], subcategoryId: string): any | null => {
    for (const category of categories) {
      if (category.children?.some((child: any) => child.id === subcategoryId)) {
        return category;
      }
    }
    return null;
  },

  /**
   * Get siblings of a category (categories at the same level)
   */
  getSiblings: (categories: any[], categoryId: string): any[] => {
    // Check if it's a root category
    const rootCategory = categories.find(cat => cat.id === categoryId);
    if (rootCategory) {
      return categories.filter(cat => cat.id !== categoryId);
    }

    // Check if it's a subcategory
    for (const category of categories) {
      if (category.children?.some((child: any) => child.id === categoryId)) {
        return category.children.filter((child: any) => child.id !== categoryId);
      }
    }

    return [];
  },

  /**
   * Calculate the next sort order for a new category/subcategory
   */
  getNextSortOrder: (siblings: any[]): number => {
    if (siblings.length === 0) return 1;
    const maxOrder = Math.max(...siblings.map(sibling => sibling.sortOrder || 0));
    return maxOrder + 1;
  },

  /**
   * Reorder categories/subcategories after a drag and drop operation
   */
  reorderItems: (items: any[], fromIndex: number, toIndex: number): any[] => {
    const result = [...items];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    
    // Update sort orders
    return result.map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));
  },

  /**
   * Move a subcategory to a different parent category
   */
  moveSubcategory: (
    categories: any[],
    subcategoryId: string,
    newParentId: string,
    newSortOrder?: number
  ): any[] => {
    const result = categories.map(category => ({ ...category, children: [...(category.children || [])] }));
    
    // Find and remove the subcategory from its current parent
    let subcategory: any = null;
    for (const category of result) {
      const childIndex = category.children?.findIndex((child: any) => child.id === subcategoryId);
      if (childIndex !== undefined && childIndex >= 0) {
        subcategory = category.children.splice(childIndex, 1)[0];
        break;
      }
    }

    if (!subcategory) return categories; // Subcategory not found

    // Add the subcategory to the new parent
    const newParent = result.find(cat => cat.id === newParentId);
    if (newParent) {
      subcategory.parentId = newParentId;
      subcategory.sortOrder = newSortOrder || categoryTreeUtils.getNextSortOrder(newParent.children || []);
      
      if (!newParent.children) {
        newParent.children = [];
      }
      newParent.children.push(subcategory);
      
      // Re-sort the children
      newParent.children.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    return result;
  },

  /**
   * Get the depth of a category in the tree (0 for root, 1 for subcategory)
   */
  getCategoryDepth: (categories: any[], categoryId: string): number => {
    // Check if it's a root category
    if (categories.some(cat => cat.id === categoryId)) {
      return 0;
    }

    // Check if it's a subcategory
    for (const category of categories) {
      if (category.children?.some((child: any) => child.id === categoryId)) {
        return 1;
      }
    }

    return -1; // Not found
  },

  /**
   * Validate if a category can be moved to a new position
   */
  canMoveCategory: (
    categories: any[],
    categoryId: string,
    targetParentId?: string
  ): boolean => {
    const category = categoryTreeUtils.findCategoryById(categories, categoryId);
    if (!category) return false;

    // Can't move a category to be its own child
    if (targetParentId === categoryId) return false;

    // Can't move a category to be a child of its own descendant
    if (targetParentId && category.children) {
      const descendantIds = categoryTreeUtils.getAllCategoryIds(category.children);
      if (descendantIds.includes(targetParentId)) return false;
    }

    return true;
  },
};

/**
 * Hook for managing general menu editor state
 */
export function useMenuEditorState() {
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(undefined);
    }
  }, []);

  return {
    selectedItemId,
    setSelectedItemId,
    isLoading,
    setIsLoading: setLoadingState,
    error,
    setError,
    clearError,
  };
}