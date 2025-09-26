import type { ComponentType } from 'react'

/**
 * Interface for individual navigation items
 */
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string
  /** Display label for the navigation item */
  label: string
  /** Route path for navigation */
  href: string
  /** Optional icon component from lucide-react */
  icon?: ComponentType<{ className?: string }>
  /** Optional badge text or number for notifications */
  badge?: string | number
  /** Optional child navigation items for hierarchical structure */
  children?: NavigationItem[]
}

/**
 * Interface for navigation groups
 */
export interface NavigationGroup {
  /** Unique identifier for the group */
  id: string
  /** Display label for the group */
  label: string
  /** Array of navigation items in this group */
  items: NavigationItem[]
}

/**
 * Interface for the complete navigation configuration
 */
export interface NavigationConfig {
  /** Array of navigation groups */
  groups: NavigationGroup[]
  /** Array of top-level navigation items (for backward compatibility) */
  items?: NavigationItem[]
}

/**
 * Type for navigation item with active state information
 * Used by navigation components to track active states
 */
export interface NavigationItemWithState extends NavigationItem {
  /** Whether this navigation item is currently active */
  isActive?: boolean
  /** Whether any child of this navigation item is currently active */
  hasActiveChild?: boolean
}

/**
 * Props interface for navigation-related components
 */
export interface NavigationProps {
  /** Navigation items to render */
  items: NavigationItem[]
  /** Current active path for highlighting */
  currentPath?: string
  /** Whether the navigation is in collapsed state */
  isCollapsed?: boolean
  /** Callback when navigation item is clicked */
  onItemClick?: (item: NavigationItem) => void
}

/**
 * Type for navigation context
 */
export interface NavigationContextType {
  /** Current navigation configuration */
  config: NavigationConfig
  /** Current active path */
  activePath: string
  /** Function to update active path */
  setActivePath: (path: string) => void
  /** Whether sidebar is collapsed */
  isCollapsed: boolean
  /** Function to toggle sidebar collapse */
  toggleCollapsed: () => void
}