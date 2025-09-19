/**
 * Configuration exports for the admin application
 */

// Navigation configuration
export {
  navigationConfig,
  findNavigationItemByHref,
  getNavigationParents,
  flattenNavigationItems
} from './navigation'

// Re-export types from types directory
export type { NavigationItem, NavigationConfig } from '../types/navigation'