import { useState, useCallback, useEffect } from 'react';

// Types for sorting preferences
export type SortingMode = 'manual' | 'alphabetical';

export interface SortingPreference {
  mode: SortingMode;
  isAlphabeticalSort: boolean;
}

export interface SortingPreferenceHook {
  isAlphabeticalSort: boolean;
  sortingMode: SortingMode;
  setSortingMode: (mode: SortingMode) => void;
  toggleSortingMode: () => void;
  resetToDefault: () => void;
}

// Constants
const SORTING_PREFERENCE_KEY = 'menu-editor-sort-mode';
const DEFAULT_SORTING_MODE: SortingMode = 'manual';

/**
 * Utility functions for sorting preference persistence
 */
export const sortingPreferenceUtils = {
  /**
   * Load sorting preference from localStorage
   */
  loadFromStorage: (): SortingMode => {
    try {
      const stored = localStorage.getItem(SORTING_PREFERENCE_KEY);
      if (stored && (stored === 'manual' || stored === 'alphabetical')) {
        return stored as SortingMode;
      }
    } catch (error) {
      console.warn('Failed to load sorting preference from localStorage:', error);
    }
    return DEFAULT_SORTING_MODE;
  },

  /**
   * Save sorting preference to localStorage
   */
  saveToStorage: (mode: SortingMode): void => {
    try {
      localStorage.setItem(SORTING_PREFERENCE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save sorting preference to localStorage:', error);
    }
  },

  /**
   * Clear sorting preference from localStorage
   */
  clearFromStorage: (): void => {
    try {
      localStorage.removeItem(SORTING_PREFERENCE_KEY);
    } catch (error) {
      console.warn('Failed to clear sorting preference from localStorage:', error);
    }
  },

  /**
   * Check if a sorting mode is valid
   */
  isValidSortingMode: (mode: string): mode is SortingMode => {
    return mode === 'manual' || mode === 'alphabetical';
  },

  /**
   * Convert sorting mode to boolean for backward compatibility
   */
  modeToBoolean: (mode: SortingMode): boolean => {
    return mode === 'alphabetical';
  },

  /**
   * Convert boolean to sorting mode for backward compatibility
   */
  booleanToMode: (isAlphabetical: boolean): SortingMode => {
    return isAlphabetical ? 'alphabetical' : 'manual';
  },
};

/**
 * Custom hook for managing sorting preference with localStorage persistence
 * 
 * This hook manages the state for alphabetical vs manual sorting modes
 * and persists the user's preference across sessions.
 * 
 * @returns {SortingPreferenceHook} Object containing sorting state and methods
 */
export function useSortingPreference(): SortingPreferenceHook {
  // Initialize state from localStorage
  const [sortingMode, setSortingModeState] = useState<SortingMode>(() => {
    return sortingPreferenceUtils.loadFromStorage();
  });

  // Derived state for backward compatibility
  const isAlphabeticalSort = sortingMode === 'alphabetical';

  // Persist to localStorage whenever sorting mode changes
  useEffect(() => {
    sortingPreferenceUtils.saveToStorage(sortingMode);
  }, [sortingMode]);

  /**
   * Set the sorting mode and persist to localStorage
   */
  const setSortingMode = useCallback((mode: SortingMode) => {
    if (sortingPreferenceUtils.isValidSortingMode(mode)) {
      setSortingModeState(mode);
    } else {
      console.warn('Invalid sorting mode provided:', mode);
    }
  }, []);

  /**
   * Toggle between manual and alphabetical sorting modes
   */
  const toggleSortingMode = useCallback(() => {
    setSortingModeState(prevMode => 
      prevMode === 'manual' ? 'alphabetical' : 'manual'
    );
  }, []);

  /**
   * Reset sorting preference to default (manual)
   */
  const resetToDefault = useCallback(() => {
    setSortingModeState(DEFAULT_SORTING_MODE);
  }, []);

  return {
    isAlphabeticalSort,
    sortingMode,
    setSortingMode,
    toggleSortingMode,
    resetToDefault,
  };
}

/**
 * Hook for managing sorting preference with additional utilities
 * This is an extended version that provides more functionality
 */
export function useSortingPreferenceExtended() {
  const baseSorting = useSortingPreference();
  
  /**
   * Set sorting mode using boolean for backward compatibility
   */
  const setAlphabeticalSort = useCallback((isAlphabetical: boolean) => {
    baseSorting.setSortingMode(
      sortingPreferenceUtils.booleanToMode(isAlphabetical)
    );
  }, [baseSorting]);

  /**
   * Get sorting preference as an object
   */
  const getSortingPreference = useCallback((): SortingPreference => {
    return {
      mode: baseSorting.sortingMode,
      isAlphabeticalSort: baseSorting.isAlphabeticalSort,
    };
  }, [baseSorting.sortingMode, baseSorting.isAlphabeticalSort]);

  /**
   * Check if drag and drop should be enabled
   * (disabled when alphabetical sorting is active)
   */
  const isDragDropEnabled = !baseSorting.isAlphabeticalSort;

  /**
   * Get the appropriate orderBy clause for database queries
   */
  const getOrderByClause = useCallback(() => {
    return baseSorting.isAlphabeticalSort 
      ? { name: 'asc' as const }
      : { sortOrder: 'asc' as const };
  }, [baseSorting.isAlphabeticalSort]);

  return {
    ...baseSorting,
    setAlphabeticalSort,
    getSortingPreference,
    isDragDropEnabled,
    getOrderByClause,
  };
}