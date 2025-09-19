import { useMemo } from 'react'
import { useLocation } from '@tanstack/react-router'
import type { NavigationItem } from '../types/navigation'

/**
 * Hook to determine if a navigation item is active based on current route
 * Provides more sophisticated matching logic for better active state detection
 */
export function useActiveNavigation(href: string): boolean {
  const location = useLocation()
  const currentPath = location.pathname

  return useMemo(() => {
    // Handle root path specially
    if (href === '/') {
      return currentPath === '/'
    }

    // Exact match for the current path
    const isExactMatch = currentPath === href
    
    // Check if current path starts with the href (for parent items)
    // Ensure we don't match partial segments (e.g., /user shouldn't match /users)
    const isParentMatch = currentPath.startsWith(href + '/') || currentPath.startsWith(href + '?')
    
    return isExactMatch || isParentMatch
  }, [currentPath, href])
}

/**
 * Hook to check if any child navigation item is active
 * Uses recursive logic to handle deeply nested navigation structures
 */
export function useHasActiveChild(children?: NavigationItem[]): boolean {
  const location = useLocation()
  const currentPath = location.pathname

  return useMemo(() => {
    if (!children || children.length === 0) return false

    const checkChildActive = (items: NavigationItem[]): boolean => {
      return items.some((child: NavigationItem): boolean => {
        // Check if this child is active
        const isChildActive = currentPath === child.href || 
                             (child.href !== '/' && (
                               currentPath.startsWith(child.href + '/') || 
                               currentPath.startsWith(child.href + '?')
                             ))
        
        // If this child is active, return true
        if (isChildActive) return true
        
        // Recursively check nested children
        if (child.children && child.children.length > 0) {
          return checkChildActive(child.children)
        }
        
        return false
      })
    }

    return checkChildActive(children)
  }, [currentPath, children])
}

/**
 * Hook to get comprehensive navigation state for an item
 * Returns both active state and child active state in a single hook
 */
export function useNavigationItemState(item: NavigationItem) {
  const isActive = useActiveNavigation(item.href)
  const hasActiveChild = useHasActiveChild(item.children)
  
  return useMemo(() => ({
    isActive,
    hasActiveChild,
    shouldHighlight: isActive || hasActiveChild,
    shouldExpand: hasActiveChild
  }), [isActive, hasActiveChild])
}

/**
 * Hook to determine if a navigation item should be expanded
 * Considers both user interaction and active child states
 */
export function useNavigationExpansion(
  item: NavigationItem,
  defaultExpanded: boolean = false
) {
  const { hasActiveChild } = useNavigationItemState(item)
  
  return useMemo(() => {
    // Always expand if there's an active child
    if (hasActiveChild) return true
    
    // Otherwise use the default expanded state
    return defaultExpanded
  }, [hasActiveChild, defaultExpanded])
}

/**
 * Hook to get all navigation items that should be highlighted
 * Useful for breadcrumb generation or complex highlighting scenarios
 */
export function useActiveNavigationPath(items: NavigationItem[]): NavigationItem[] {
  const location = useLocation()
  const currentPath = location.pathname

  return useMemo(() => {
    const activePath: NavigationItem[] = []

    const findActivePath = (navItems: NavigationItem[], path: NavigationItem[] = []): boolean => {
      for (const item of navItems) {
        const currentItemPath = [...path, item]
        
        // Check if this item is active
        const isActive = currentPath === item.href || 
                        (item.href !== '/' && (
                          currentPath.startsWith(item.href + '/') || 
                          currentPath.startsWith(item.href + '?')
                        ))

        if (isActive) {
          activePath.push(...currentItemPath)
          return true
        }

        // Check children recursively
        if (item.children && item.children.length > 0) {
          if (findActivePath(item.children, currentItemPath)) {
            return true
          }
        }
      }
      return false
    }

    findActivePath(items)
    return activePath
  }, [currentPath, items])
}

/**
 * Hook to check if a specific path matches the current route
 * More flexible than useActiveNavigation for custom matching logic
 */
export function useRouteMatch(
  path: string, 
  options: {
    exact?: boolean
    caseSensitive?: boolean
  } = {}
): boolean {
  const location = useLocation()
  const currentPath = location.pathname
  
  return useMemo(() => {
    const { exact = false, caseSensitive = true } = options
    
    const comparePath = caseSensitive ? path : path.toLowerCase()
    const compareCurrentPath = caseSensitive ? currentPath : currentPath.toLowerCase()
    
    if (exact) {
      return compareCurrentPath === comparePath
    }
    
    // Handle root path specially
    if (comparePath === '/') {
      return compareCurrentPath === '/'
    }
    
    return compareCurrentPath === comparePath || 
           compareCurrentPath.startsWith(comparePath + '/') ||
           compareCurrentPath.startsWith(comparePath + '?')
  }, [currentPath, path, options])
}