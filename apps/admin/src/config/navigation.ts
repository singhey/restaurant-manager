import { 
  Home, 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  Shield,
  UserPlus,
  UserCheck,
  Cog,
  Database,
  Bell
} from 'lucide-react'
import type { NavigationItem, NavigationConfig } from '../types/navigation'

/**
 * Main navigation configuration for the admin application
 * This configuration drives the sidebar navigation menu
 */
export const navigationConfig: NavigationConfig = {
  items: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      icon: Home
    },
    {
      id: 'users',
      label: 'Users',
      href: '/users',
      icon: Users,
      badge: '12',
      children: [
        {
          id: 'users-list',
          label: 'All Users',
          href: '/users'
        },
        {
          id: 'users-create',
          label: 'Create User',
          href: '/users/create',
          icon: UserPlus
        },
        {
          id: 'users-active',
          label: 'Active Users',
          href: '/users/active',
          icon: UserCheck
        }
      ]
    },
    {
      id: 'content',
      label: 'Content',
      href: '/content',
      icon: FileText,
      children: [
        {
          id: 'content-posts',
          label: 'Posts',
          href: '/content/posts'
        },
        {
          id: 'content-pages',
          label: 'Pages',
          href: '/content/pages'
        },
        {
          id: 'content-media',
          label: 'Media Library',
          href: '/content/media'
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: 'New'
    },
    {
      id: 'system',
      label: 'System',
      href: '/system',
      icon: Database,
      children: [
        {
          id: 'system-settings',
          label: 'Settings',
          href: '/system/settings',
          icon: Cog
        },
        {
          id: 'system-security',
          label: 'Security',
          href: '/system/security',
          icon: Shield
        },
        {
          id: 'system-notifications',
          label: 'Notifications',
          href: '/system/notifications',
          icon: Bell,
          badge: 3
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ]
}

/**
 * Helper function to find a navigation item by its href
 * Useful for determining active states and breadcrumbs
 */
export function findNavigationItemByHref(href: string, items: NavigationItem[] = navigationConfig.items): NavigationItem | null {
  for (const item of items) {
    if (item.href === href) {
      return item
    }
    if (item.children) {
      const found = findNavigationItemByHref(href, item.children)
      if (found) {
        return found
      }
    }
  }
  return null
}

/**
 * Helper function to get all parent navigation items for a given href
 * Useful for highlighting parent items when child is active
 */
export function getNavigationParents(href: string, items: NavigationItem[] = navigationConfig.items, parents: NavigationItem[] = []): NavigationItem[] {
  for (const item of items) {
    if (item.href === href) {
      return parents
    }
    if (item.children) {
      const found = getNavigationParents(href, item.children, [...parents, item])
      if (found.length > 0 || item.children.some(child => child.href === href)) {
        return [...parents, item]
      }
    }
  }
  return []
}

/**
 * Helper function to flatten navigation items (including children)
 * Useful for search functionality or generating sitemaps
 */
export function flattenNavigationItems(items: NavigationItem[] = navigationConfig.items): NavigationItem[] {
  const flattened: NavigationItem[] = []
  
  for (const item of items) {
    flattened.push(item)
    if (item.children) {
      flattened.push(...flattenNavigationItems(item.children))
    }
  }
  
  return flattened
}