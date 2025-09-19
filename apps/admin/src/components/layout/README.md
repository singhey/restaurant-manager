# Navigation Active State Highlighting

This document explains the implementation of active state highlighting logic for the admin navigation system.

## Overview

The active state highlighting system provides visual feedback to users about their current location within the application. It supports:

- **Exact route matching**: Highlights navigation items that exactly match the current route
- **Parent route highlighting**: Highlights parent navigation items when child routes are active
- **Hierarchical highlighting**: Supports multi-level nested navigation structures
- **Automatic expansion**: Expands parent menus when child items are active

## Implementation

### Core Hooks

#### `useActiveNavigation(href: string): boolean`

Determines if a navigation item should be considered active based on the current route.

**Logic:**
- Root path (`/`) only matches exactly
- Other paths match exactly or as parent paths
- Handles query parameters correctly
- Prevents partial segment matching (e.g., `/user` won't match `/users`)

**Example:**
```typescript
const isActive = useActiveNavigation('/users')
// Returns true for: /users, /users/create, /users/123
// Returns false for: /user, /settings
```

#### `useHasActiveChild(children?: NavigationItem[]): boolean`

Recursively checks if any child navigation item is active.

**Features:**
- Handles deeply nested navigation structures
- Memoized for performance
- Returns false for undefined/empty children arrays

#### `useNavigationItemState(item: NavigationItem)`

Comprehensive hook that returns all navigation state for an item:

```typescript
const {
  isActive,        // This item is directly active
  hasActiveChild,  // A child item is active
  shouldHighlight, // Item should be visually highlighted
  shouldExpand     // Parent menu should be expanded
} = useNavigationItemState(item)
```

### Component Integration

#### NavigationMenuItem Component

**Active State Styling:**
- Uses `data-active` attribute for CSS targeting
- Applies `bg-sidebar-accent` background for active items
- Enhanced typography (font-medium) for active states
- Icon color changes for better visual hierarchy

**Expansion Logic:**
- Automatically expands when child is active
- Maintains user-controlled expansion state
- Smooth transitions with CSS animations

**Navigation Behavior:**
- Parent items with children can either navigate or just toggle
- Prevents navigation when clicking expand/collapse areas
- Proper event handling for keyboard navigation

#### NavigationMenuSubItem Component

**Nested Support:**
- Handles unlimited nesting levels
- Consistent styling across all levels
- Proper indentation and visual hierarchy

**Active State Inheritance:**
- Child items inherit active state logic
- Proper badge styling for active states
- Consistent hover and focus states

## Styling System

### CSS Classes

The active state system uses the following CSS classes from the sidebar component:

```css
/* Active state backgrounds */
.bg-sidebar-accent
.text-sidebar-accent-foreground

/* Hover states */
.hover:bg-sidebar-accent/50
.hover:bg-sidebar-accent/30

/* Badge styling */
.bg-sidebar-primary (for active badges)
```

### Data Attributes

Components use `data-active` attributes for advanced CSS targeting:

```css
[data-active="true"] {
  /* Active state styles */
}
```

## Testing

### Manual Testing Routes

The following test routes are available to verify active state behavior:

1. **Dashboard** (`/`) - Single level, root path
2. **Users** (`/users`) - Parent with children
3. **Create User** (`/users/create`) - Child item
4. **Active Users** (`/users/active`) - Child item with icon
5. **Settings** (`/settings`) - Single level, non-root

### Debug Component

Press `Ctrl+Shift+D` to toggle the navigation debug overlay that shows:
- Current pathname
- Active navigation path
- State of each navigation item (active, hasActiveChild, shouldHighlight)

### Expected Behaviors

#### When on `/users`:
- ✅ "Users" item is highlighted
- ✅ "Users" submenu is expanded
- ❌ Child items are not highlighted

#### When on `/users/create`:
- ✅ "Users" parent is highlighted
- ✅ "Create User" child is highlighted  
- ✅ "Users" submenu is expanded
- ✅ Both items show active styling

#### When on `/settings`:
- ✅ "Settings" item is highlighted
- ❌ No other items are highlighted
- ❌ No submenus are expanded

## Performance Considerations

### Memoization

All hooks use `useMemo` to prevent unnecessary recalculations:
- Route matching logic is memoized based on current path
- Child active state checking is memoized
- Navigation state objects are memoized

### Efficient Updates

- Hooks only re-run when the current pathname changes
- Component re-renders are minimized through proper memoization
- Event handlers are optimized to prevent excessive state updates

## Accessibility

### Keyboard Navigation

- All navigation items are keyboard accessible
- Proper focus management for expanded/collapsed states
- ARIA attributes for screen readers (inherited from sidebar components)

### Visual Indicators

- High contrast active states for better visibility
- Consistent visual hierarchy across all navigation levels
- Clear distinction between active and inactive states

## Future Enhancements

### Potential Improvements

1. **Breadcrumb Integration**: Use `useActiveNavigationPath` for automatic breadcrumb generation
2. **Animation Enhancements**: Add smooth transitions for active state changes
3. **Custom Matching**: Support custom route matching logic per navigation item
4. **State Persistence**: Remember expanded/collapsed states across sessions
5. **Analytics Integration**: Track navigation usage patterns

### Configuration Options

Future versions could support:
- Custom active state detection logic
- Configurable expansion behavior
- Theme-specific active state styling
- Performance optimization settings