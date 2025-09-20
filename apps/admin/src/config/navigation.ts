import {
  Home,
  Users,
  Store,
  Receipt,
  ShoppingCart,
  ChefHat,
  History,
  Globe,
  Building2,
  User,
  Edit3,
  Plus,
  Gift,
  Tag,
  Eye
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
      id: 'bill-menu',
      label: 'Bill Menu',
      href: '/menu/billing',
      icon: Receipt
    },
    {
      id: 'live-orders',
      label: 'Live Orders',
      href: '/orders/live',
      icon: ShoppingCart
    },
    {
      id: 'kitchen-display',
      label: 'Kitchen Display System',
      href: '/orders/kitchen',
      icon: ChefHat
    },
    {
      id: 'outlet-history',
      label: 'Outlet Order History',
      href: '/orders/outlet-history',
      icon: History
    },
    {
      id: 'online-history',
      label: 'Online Order History',
      href: '/orders/online-history',
      icon: Globe
    },
    {
      id: 'customers',
      label: 'Customers',
      href: '/customers',
      icon: Users
    },
    {
      id: 'management',
      label: 'Management',
      href: '/management',
      icon: Edit3,
      children: [
        {
          id: 'edit-menu',
          label: 'Edit Menu',
          href: '/menu/edit',
          icon: Edit3
        },
        {
          id: 'edit-addons',
          label: 'Edit Addons',
          href: '/menu/addons',
          icon: Plus
        },
        {
          id: 'edit-vouchers',
          label: 'Edit Vouchers',
          href: '/menu/vouchers',
          icon: Gift
        },
        {
          id: 'add-offers',
          label: 'Add Offers',
          href: '/menu/offers',
          icon: Tag
        }
      ]
    },
    {
      id: 'account',
      label: 'Account',
      href: '/account',
      icon: User
    },
    {
      id: 'store-details',
      label: 'Store Details',
      href: '/store/details',
      icon: Store
    },
    {
      id: 'all-stores',
      label: 'All Stores',
      href: '/stores',
      icon: Building2
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