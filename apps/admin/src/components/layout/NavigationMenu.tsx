import React from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
} from '@workspace/ui/components/sidebar'
import { navigationConfig } from '../../config/navigation'
import { useNavigationItemState } from '../../hooks/useNavigationState'
import type { NavigationItem } from '../../types/navigation'

/**
 * Component for rendering individual navigation menu items
 */
interface NavigationMenuItemProps {
  item: NavigationItem
}

function NavigationMenuItem({ item }: NavigationMenuItemProps) {
  // console.log(item)
  const { isActive, shouldHighlight, shouldExpand } = useNavigationItemState(item)
  const {restaurantId} = useParams({from: `/restaurant/manage/$restaurantId`})

  // Manage expansion state with proper active child handling
  const [isExpanded, setIsExpanded] = React.useState(shouldExpand)

  // Update expansion state when active child changes
  React.useEffect(() => {
    if (shouldExpand) {
      setIsExpanded(true)
    }
  }, [shouldExpand])

  const handleToggle = (e: React.MouseEvent) => {
    if (item.children && item.children.length > 0) {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  // Determine if this is a parent item that should navigate or just toggle
  const hasChildren = item.children && item.children.length > 0
  const shouldNavigate = !hasChildren || isActive

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild={shouldNavigate}
        isActive={shouldHighlight}
        className={`group/menu-item transition-colors ${
          shouldHighlight 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
            : 'hover:bg-sidebar-accent/50'
        }`}
        data-active={shouldHighlight}
      >
        {shouldNavigate ? (
          <Link
            to={item.href}
            className="flex items-center gap-2 w-full"
            params={{restaurantId}}
            onClick={hasChildren ? handleToggle : undefined}
          >
            {item.icon && (
              <item.icon 
                className={`h-4 w-4 transition-colors ${
                  shouldHighlight ? 'text-sidebar-accent-foreground' : ''
                }`} 
              />
            )}
            <span className="flex-1 font-medium">{item.label}</span>
            
            {/* Show badge if present */}
            {item.badge && (
              <SidebarMenuBadge className={shouldHighlight ? 'bg-sidebar-primary' : ''}>
                {item.badge}
              </SidebarMenuBadge>
            )}
            
            {/* Show chevron for items with children */}
            {hasChildren && (
              <ChevronRight 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                } ${shouldHighlight ? 'text-sidebar-accent-foreground' : ''}`}
              />
            )}
          </Link>
        ) : (
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 w-full text-left"
          >
            {item.icon && (
              <item.icon 
                className={`h-4 w-4 transition-colors ${
                  shouldHighlight ? 'text-sidebar-accent-foreground' : ''
                }`} 
              />
            )}
            <span className="flex-1 font-medium">{item.label}</span>
            
            {/* Show badge if present */}
            {item.badge && (
              <SidebarMenuBadge className={shouldHighlight ? 'bg-sidebar-primary' : ''}>
                {item.badge}
              </SidebarMenuBadge>
            )}
            
            {/* Show chevron for items with children */}
            <ChevronRight 
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              } ${shouldHighlight ? 'text-sidebar-accent-foreground' : ''}`}
            />
          </button>
        )}
      </SidebarMenuButton>

      {/* Render sub-menu if item has children and is expanded */}
      {hasChildren && isExpanded && (
        <SidebarMenuSub className="border-l border-sidebar-border ml-4 pl-4">
          {item.children!.map((child) => (
            <NavigationMenuSubItem key={child.id} item={child} />
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}

/**
 * Component for rendering sub-menu items
 */
interface NavigationMenuSubItemProps {
  item: NavigationItem
}

function NavigationMenuSubItem({ item }: NavigationMenuSubItemProps) {
  const { isActive, hasActiveChild, shouldHighlight } = useNavigationItemState(item)
  const {restaurantId} = useParams({from: `/restaurant/manage/$restaurantId`})

  console.log(restaurantId)

  // Handle nested children if they exist
  const [isExpanded, setIsExpanded] = React.useState(hasActiveChild)

  React.useEffect(() => {
    if (hasActiveChild) {
      setIsExpanded(true)
    }
  }, [hasActiveChild])

  const handleToggle = (e: React.MouseEvent) => {
    if (item.children && item.children.length > 0) {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  const hasChildren = item.children && item.children.length > 0

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton 
        asChild={!hasChildren}
        isActive={shouldHighlight}
        className={`transition-colors ${
          shouldHighlight 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
            : 'hover:bg-sidebar-accent/30'
        }`}
        data-active={shouldHighlight}
      >
        {!hasChildren ? (
          <Link to={item.href} params={{restaurantId}} className="flex items-center gap-2">
            {item.icon && (
              <item.icon 
                className={`h-4 w-4 ${
                  shouldHighlight ? 'text-sidebar-accent-foreground' : ''
                }`} 
              />
            )}
            <span className="flex-1">{item.label}</span>
            
            {/* Show badge if present */}
            {item.badge && (
              <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${
                shouldHighlight 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'bg-sidebar-accent text-sidebar-accent-foreground'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ) : (
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 w-full text-left"
          >
            {item.icon && (
              <item.icon 
                className={`h-4 w-4 ${
                  shouldHighlight ? 'text-sidebar-accent-foreground' : ''
                }`} 
              />
            )}
            <span className="flex-1">{item.label}</span>
            
            {/* Show badge if present */}
            {item.badge && (
              <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${
                shouldHighlight 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'bg-sidebar-accent text-sidebar-accent-foreground'
              }`}>
                {item.badge}
              </span>
            )}
            
            <ChevronRight 
              className={`h-3 w-3 ml-1 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              } ${shouldHighlight ? 'text-sidebar-accent-foreground' : ''}`}
            />
          </button>
        )}
      </SidebarMenuSubButton>

      {/* Render nested sub-menu if item has children and is expanded */}
      {hasChildren && isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavigationMenuSubItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </SidebarMenuSubItem>
  )
}

/**
 * Main NavigationMenu component that renders the complete navigation structure
 */
export function NavigationMenu() {
  return (
    <SidebarMenu>
      {navigationConfig.items.map((item) => (
        <NavigationMenuItem key={item.id} item={item} />
      ))}
    </SidebarMenu>
  )
}