import {
  Home,
  Users,
  Store,
  Receipt,
  ShoppingCart,
  ChefHat,
  History,
  Building2,
  User,
  Edit3,
  Plus,
  Eye
} from 'lucide-react'
import type { NavigationItem, NavigationConfig } from '../types/navigation'

/**
 * Main navigation configuration for the admin application
 * This configuration drives the sidebar navigation menu
 */
export const navigationConfig: NavigationConfig = {
  groups: [
    {
      id: 'billing',
      label: 'Billing & Operations',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: '/restaurant/manage/$restaurantId',
          icon: Home
        },
        {
          id: 'bill-menu',
          label: 'Bill Menu',
          href: '/restaurant/manage/$restaurantId/menu/billing',
          icon: Receipt
        },
        {
          id: 'live-orders',
          label: 'Live Orders',
          href: '/restaurant/manage/$restaurantId/orders/live',
          icon: ShoppingCart
        },
        {
          id: 'kitchen-display',
          label: 'Kitchen Display System',
          href: '/restaurant/manage/$restaurantId/orders/kitchen',
          icon: ChefHat
        },
        {
          id: 'outlet-history',
          label: 'Outlet Orders',
          href: '/restaurant/manage/$restaurantId/orders',
          icon: History
        },
        {
          id: 'customers',
          label: 'Customers',
          href: '/restaurant/manage/$restaurantId/customers',
          icon: Users
        }
      ]
    },
    {
      id: 'admin',
      label: 'Administration',
      items: [
        {
          id: 'management',
          label: 'Menu Management',
          href: '/restaurant/manage/$restaurantId/menu/edit',
          icon: Edit3
        },
        {
          id: 'users',
          label: 'User Management',
          href: '/restaurant/manage/$restaurantId/users',
          icon: Users,
          children: [
            {
              id: 'users-active',
              label: 'Active Users',
              href: '/restaurant/manage/$restaurantId/users/active',
              icon: Eye
            },
            {
              id: 'users-create',
              label: 'Create User',
              href: '/restaurant/manage/$restaurantId/users/create',
              icon: Plus
            }
          ]
        },
        {
          id: 'store-details',
          label: 'Store Details',
          href: '/restaurant/manage/$restaurantId/store/details',
          icon: Store
        },
        {
          id: 'all-stores',
          label: 'All Stores',
          href: '/restaurant/manage/$restaurantId/stores',
          icon: Building2
        },
        {
          id: 'account',
          label: 'Account Settings',
          href: '/restaurant/manage/$restaurantId/account',
          icon: User
        }
      ]
    }
  ],
  // Backward compatibility - flatten all items for legacy code
  get items() {
    return this.groups.flatMap(group => group.items)
  }
}

/**
 * Helper function to get all navigation items from all groups
 */
export function getAllNavigationItems(): NavigationItem[] {
  return navigationConfig.groups.flatMap(group => group.items)
}

/**
 * Helper function to find a navigation item by its href
 * Useful for determining active states and breadcrumbs
 */
export function findNavigationItemByHref(href: string, items?: NavigationItem[]): NavigationItem | null {
  const searchItems = items || getAllNavigationItems()

  for (const item of searchItems) {
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
export function getNavigationParents(href: string, items?: NavigationItem[], parents: NavigationItem[] = []): NavigationItem[] {
  const searchItems = items || getAllNavigationItems()

  for (const item of searchItems) {
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
export function flattenNavigationItems(items?: NavigationItem[]): NavigationItem[] {
  const searchItems = items || getAllNavigationItems()
  const flattened: NavigationItem[] = []

  for (const item of searchItems) {
    flattened.push(item)
    if (item.children) {
      flattened.push(...flattenNavigationItems(item.children))
    }
  }

  return flattened
}