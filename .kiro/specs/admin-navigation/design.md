# Design Document

## Overview

The admin navigation system will implement a comprehensive layout featuring a topbar and configurable sidebar navigation. The design leverages the existing UI package's sidebar component and integrates seamlessly with TanStack Router to provide consistent navigation across all admin pages. The system will follow a dark theme aesthetic inspired by better-auth.com with proper active state highlighting.

## Architecture

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Brand Name  |       Topbar                              │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│   Sidebar   │            Main Content                   │
│             │            (Outlet)                       │
│             │                                           │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

### Component Hierarchy
- **SidebarProvider**: Root wrapper providing sidebar context
- **Sidebar**: Main sidebar container with collapsible functionality
- **Topbar**: Header component with branding and user actions
- **SidebarInset**: Main content area that adjusts to sidebar state
- **NavigationMenu**: Dynamic menu component driven by configuration

## Components and Interfaces

### 1. Navigation Configuration Interface
```typescript
interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType
  badge?: string | number
  children?: NavigationItem[]
}

interface NavigationConfig {
  items: NavigationItem[]
}
```

### 2. Topbar Component
- **Purpose**: Provides consistent header across all pages
- **Features**:
  - Sidebar toggle button (SidebarTrigger)
  - Application branding/logo
  - User profile dropdown
  - Dark theme styling
- **Integration**: Uses existing UI components (Button, DropdownMenu)

### 3. Dynamic Sidebar Menu Component
- **Purpose**: Renders navigation items from configuration
- **Features**:
  - Hierarchical menu support (parent/child items)
  - Active state detection using TanStack Router
  - Icon support with Lucide React
  - Badge/notification support
  - Collapsible sub-menus
- **Integration**: Uses SidebarMenu, SidebarMenuItem, SidebarMenuButton components

### 4. Navigation Configuration
- **Location**: `apps/admin/src/config/navigation.ts`
- **Format**: TypeScript object export
- **Benefits**: 
  - Easy to modify without code changes
  - Type-safe configuration
  - Supports dynamic menu generation

## Data Models

### Navigation Configuration Structure
```typescript
export const navigationConfig: NavigationConfig = {
  items: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      icon: HomeIcon
    },
    {
      id: 'users',
      label: 'Users',
      href: '/users',
      icon: UsersIcon,
      children: [
        {
          id: 'users-list',
          label: 'All Users',
          href: '/users'
        },
        {
          id: 'users-create',
          label: 'Create User',
          href: '/users/create'
        }
      ]
    }
  ]
}
```

### Active State Detection
- **Method**: Use TanStack Router's `useRouterState()` hook
- **Logic**: Match current pathname against navigation item hrefs
- **Hierarchy**: Support parent highlighting when child is active

## Error Handling

### Navigation Configuration Errors
- **Invalid Routes**: Graceful fallback to prevent navigation breaks
- **Missing Icons**: Default icon fallback (ChevronRight or similar)
- **Malformed Config**: Console warnings with fallback to empty menu

### Router Integration Errors
- **Route Mismatch**: Continue rendering without active highlighting
- **Navigation Failures**: Maintain current state, log errors

## Testing Strategy

### Unit Tests
- Navigation configuration parsing
- Active state detection logic
- Menu item rendering with various props
- Responsive behavior (mobile/desktop)

### Integration Tests
- Full navigation flow with TanStack Router
- Sidebar collapse/expand functionality
- Active state updates on route changes
- Configuration-driven menu rendering

### Visual Tests
- Dark theme styling consistency
- Active state visual indicators
- Responsive layout behavior
- Icon and badge rendering

## Implementation Details

### TanStack Router Integration
- **Root Layout**: Implement in `__root.tsx` using SidebarProvider wrapper
- **Active Detection**: Use `useLocation()` and `useMatches()` hooks
- **Link Components**: Use TanStack Router's `Link` component for navigation

### Styling Approach
- **Theme**: Leverage existing dark theme CSS variables
- **Active States**: Use `data-[active=true]` attributes for styling
- **Responsive**: Mobile-first approach with sidebar sheet on mobile
- **Animations**: Smooth transitions for sidebar collapse/expand

### Performance Considerations
- **Configuration Loading**: Static import for immediate availability
- **Re-renders**: Memoize navigation components to prevent unnecessary updates
- **Route Matching**: Efficient pathname comparison for active states

## File Structure
```
apps/admin/src/
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx
│   │   └── NavigationMenu.tsx
├── config/
│   └── navigation.ts
└── routes/
    └── __root.tsx (updated)
```

## Dependencies
- **Existing**: @workspace/ui sidebar components
- **Router**: @tanstack/react-router hooks and components  
- **Icons**: lucide-react for navigation icons
- **Styling**: Existing CSS variables and Tailwind classes