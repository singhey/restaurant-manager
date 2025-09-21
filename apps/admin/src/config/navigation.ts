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
      label: 'Outlet Order History',
      href: '/restaurant/manage/$restaurantId/orders/outlet-history',
      icon: History
    },
    {
      id: 'online-history',
      label: 'Online Order History',
      href: '/restaurant/manage/$restaurantId/orders/online-history',
      icon: Globe
    },
    {
      id: 'customers',
      label: 'Customers',
      href: '/restaurant/manage/$restaurantId/customers',
      icon: Users
    },
    {
      id: 'management',
      label: 'Management',
      href: '/restaurant/manage/$restaurantId/management',
      icon: Edit3,
      children: [
        {
          id: 'edit-menu',
          label: 'Edit Menu',
          href: '/restaurant/manage/$restaurantId/menu/edit',
          icon: Edit3
        },
        {
          id: 'edit-addons',
          label: 'Edit Addons',
          href: '/restaurant/manage/$restaurantId/menu/addons',
          icon: Plus
        },
        {
          id: 'edit-vouchers',
          label: 'Edit Vouchers',
          href: '/restaurant/manage/$restaurantId/menu/vouchers',
          icon: Gift
        },
        {
          id: 'add-offers',
          label: 'Add Offers',
          href: '/restaurant/manage/$restaurantId/menu/offers',
          icon: Tag
        }
      ]
    },
    {
      id: 'users',
      label: 'Users',
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
      id: 'account',
      label: 'Account',
      href: '/restaurant/manage/$restaurantId/account',
      icon: User
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