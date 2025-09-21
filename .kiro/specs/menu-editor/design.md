# Design Document

## Overview

The menu editor feature provides a comprehensive interface for restaurant administrators to manage their menu structure through categories, subcategories, and items. The feature is built as a React component accessible at `/menu/edit` route and follows a two-panel layout design with the menu structure management on the left and item details editor on the right (to be implemented in a future phase).

This design focuses on the left panel implementation, which handles category and subcategory management with drag-and-drop reordering capabilities. The interface integrates seamlessly with the existing ZenStack/tRPC backend and follows the established design patterns of the admin application.

## Architecture

### Component Structure

```
MenuEditPage
├── MenuStructurePanel (Left Panel)
│   ├── CategoryList
│   │   ├── CategoryItem
│   │   │   ├── CategoryHeader
│   │   │   ├── SubcategoryList
│   │   │   │   └── SubcategoryItem
│   │   │   └── AddSubcategoryButton
│   │   └── AddCategoryButton
│   └── DragDropProvider
└── ItemEditorPanel (Right Panel - Future Implementation)
```

### Technology Stack

- **Frontend Framework**: React with TypeScript
- **Routing**: TanStack Router (existing pattern)
- **State Management**: TanStack Query with ZenStack hooks
- **UI Components**: Workspace UI components (Sidebar, Button, Input, Select, etc.)
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **Styling**: Tailwind CSS (existing pattern)
- **Backend Integration**: ZenStack hooks with tRPC

### Required Dependencies

The following packages need to be installed for the drag-and-drop functionality:

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Data Flow

1. **Data Fetching**: Use `useFindManyCategory` hook to fetch categories with nested subcategories and item counts
2. **Mutations**: Use ZenStack mutation hooks (`useCreateCategory`, `useUpdateCategory`, `useDeleteCategory`) for CRUD operations
3. **Optimistic Updates**: Leverage ZenStack's optimistic update capabilities for immediate UI feedback
4. **Error Handling**: Implement error boundaries and toast notifications for failed operations

## Components and Interfaces

### MenuEditPage Component

**Purpose**: Main page component that orchestrates the menu editing interface

**Props**: None (route-based component)

**State Management**:
- Categories data via `useFindManyCategory`
- Loading and error states
- Expanded/collapsed category states (local state)

### MenuStructurePanel Component

**Purpose**: Left panel containing the hierarchical menu structure

**Props**:
```typescript
interface MenuStructurePanelProps {
  onItemSelect?: (itemId: string) => void; // For future item editor integration
}
```

**Features**:
- Displays hierarchical category/subcategory structure
- Handles drag-and-drop reordering
- Manages expand/collapse states
- Provides add/delete functionality
- Toggle between manual ordering and alphabetical sorting
- Persists sorting preference across sessions

### CategoryItem Component

**Purpose**: Individual category display with subcategories

**Props**:
```typescript
interface CategoryItemProps {
  category: CategoryWithSubcategories;
  isExpanded: boolean;
  onToggleExpanded: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onReorder: (categoryId: string, newOrder: number) => void;
}
```

**Features**:
- Expandable/collapsible display
- Drag handle for reordering
- Delete confirmation
- Item count display
- Nested subcategory management

### SubcategoryItem Component

**Purpose**: Individual subcategory display within categories

**Props**:
```typescript
interface SubcategoryItemProps {
  subcategory: SubcategoryWithItems;
  onDelete: (subcategoryId: string) => void;
  onReorder: (subcategoryId: string, newOrder: number, newParentId?: string) => void;
}
```

**Features**:
- Drag handle for reordering
- Delete confirmation
- Item count display
- Cross-category drag support

### AddCategoryForm Component

**Purpose**: Form for creating new categories

**Props**:
```typescript
interface AddCategoryFormProps {
  onSubmit: (data: CreateCategoryData) => void;
  onCancel: () => void;
}
```

**Validation**:
- Required name field
- Unique name validation
- Character limits

### AddSubcategoryForm Component

**Purpose**: Form for creating new subcategories

**Props**:
```typescript
interface AddSubcategoryFormProps {
  parentCategoryId: string;
  onSubmit: (data: CreateSubcategoryData) => void;
  onCancel: () => void;
}
```

## Data Models

### Category Data Structure

Based on the ZenStack schema analysis, categories have the following structure:

```typescript
interface Category {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  parentId?: string; // For subcategories
  children?: Category[]; // Nested subcategories
  menuItems?: MenuItem[]; // Associated menu items
  _count?: {
    children: number;
    menuItems: number;
  };
}
```

### Query Patterns

**Fetch Categories with Hierarchy**:
```typescript
const { data: categories } = useFindManyCategory({
  where: {
    restaurantId: currentRestaurantId,
    parentId: null // Only root categories
  },
  include: {
    children: {
      include: {
        _count: {
          select: { menuItems: true }
        }
      },
      orderBy: isAlphabeticalSort ? { name: 'asc' } : { sortOrder: 'asc' }
    },
    _count: {
      select: { 
        children: true,
        menuItems: true 
      }
    }
  },
  orderBy: isAlphabeticalSort ? { name: 'asc' } : { sortOrder: 'asc' }
});
```

**Create Category**:
```typescript
const createCategory = useCreateCategory({
  onSuccess: () => {
    // Invalidate categories query
    queryClient.invalidateQueries(['Category']);
  }
});
```

## Error Handling

### Error Boundaries

Implement error boundaries at the page level to catch and display meaningful error messages for:
- Network failures
- Permission errors
- Data validation errors
- Unexpected component errors

### Validation Strategy

**Client-side Validation**:
- Form field validation using react-hook-form
- Real-time feedback for invalid inputs
- Prevent submission of invalid data

**Server-side Validation**:
- Handle ZenStack validation errors
- Display server error messages
- Graceful fallback for validation failures

### Error Recovery

- Retry mechanisms for failed network requests
- Optimistic update rollback on failures
- Clear error states on successful operations

## Testing Strategy

### Unit Tests

**Component Testing**:
- Test category/subcategory rendering
- Test form validation and submission
- Test drag-and-drop interactions
- Test expand/collapse functionality

**Hook Testing**:
- Test ZenStack hook integrations
- Test error handling scenarios
- Test optimistic updates

### Integration Tests

**User Workflow Testing**:
- Complete category creation flow
- Complete subcategory creation flow
- Drag-and-drop reordering scenarios
- Delete confirmation workflows

### E2E Tests

**Critical Path Testing**:
- Full menu structure management workflow
- Cross-browser drag-and-drop compatibility
- Mobile responsiveness testing

## Sorting Implementation

### Sorting Options

The menu editor provides two sorting modes:

**Manual Ordering**:
- Uses the `sortOrder` field from the database
- Enables drag-and-drop reordering functionality
- Allows custom arrangement of categories and subcategories
- Default mode for new users

**Alphabetical Sorting**:
- Sorts categories and subcategories lexicographically by name
- Disables drag-and-drop functionality when active
- Provides consistent alphabetical organization
- Useful for large menus with many categories

### Sorting State Management

```typescript
interface SortingState {
  isAlphabeticalSort: boolean;
  setSortingMode: (alphabetical: boolean) => void;
}

// Custom hook for sorting preference
const useSortingPreference = () => {
  const [isAlphabeticalSort, setIsAlphabeticalSort] = useState(() => {
    return localStorage.getItem('menu-editor-sort-mode') === 'alphabetical';
  });

  const setSortingMode = (alphabetical: boolean) => {
    setIsAlphabeticalSort(alphabetical);
    localStorage.setItem('menu-editor-sort-mode', alphabetical ? 'alphabetical' : 'manual');
  };

  return { isAlphabeticalSort, setSortingMode };
};
```

### Sorting Toggle Component

```typescript
interface SortingToggleProps {
  isAlphabeticalSort: boolean;
  onToggle: (alphabetical: boolean) => void;
  disabled?: boolean;
}

const SortingToggle: React.FC<SortingToggleProps> = ({
  isAlphabeticalSort,
  onToggle,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-toggle">Sort:</Label>
      <Select
        value={isAlphabeticalSort ? 'alphabetical' : 'manual'}
        onValueChange={(value) => onToggle(value === 'alphabetical')}
        disabled={disabled}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="alphabetical">A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
```

## Drag and Drop Implementation

### Library Choice

Use `@dnd-kit` for drag-and-drop functionality due to:
- Excellent accessibility support
- Touch device compatibility
- Flexible API for complex scenarios
- Active maintenance and community support

### Drag Contexts

**Category Reordering** (Manual Mode Only):
- Allow dragging categories to reorder within the same level
- Update `sortOrder` field on drop
- Provide visual feedback during drag
- Disabled when alphabetical sorting is active

**Subcategory Reordering** (Manual Mode Only):
- Allow dragging subcategories within the same category
- Allow dragging subcategories between different categories
- Update both `sortOrder` and `parentId` on cross-category moves
- Disabled when alphabetical sorting is active

### Visual Feedback

- Drag overlay showing the item being dragged
- Drop zones with visual indicators
- Smooth animations for reordering
- Loading states during server updates

## Performance Considerations

### Data Loading

- Implement pagination for large category lists
- Use React.memo for category/subcategory components
- Debounce search and filter operations

### Drag Performance

- Virtualization for large lists (if needed)
- Throttle drag events to prevent excessive re-renders
- Optimize drag overlay rendering

### Caching Strategy

- Leverage TanStack Query caching for categories
- Implement optimistic updates for immediate feedback
- Cache expanded/collapsed states in localStorage

## Accessibility

### Keyboard Navigation

- Full keyboard support for all interactions
- Tab order follows logical hierarchy
- Escape key to cancel operations

### Screen Reader Support

- Proper ARIA labels for all interactive elements
- Announce drag-and-drop operations
- Descriptive text for category/subcategory relationships

### Visual Accessibility

- High contrast mode support
- Focus indicators for all interactive elements
- Sufficient color contrast ratios

## Mobile Responsiveness

### Touch Interactions

- Touch-friendly drag-and-drop using @dnd-kit touch sensors
- Appropriate touch target sizes (minimum 44px)
- Swipe gestures for mobile-specific actions

### Layout Adaptations

- Responsive sidebar behavior using existing patterns
- Collapsible category sections on small screens
- Optimized form layouts for mobile input

## Integration Points

### Existing Systems

**Authentication**: Integrate with existing AuthProvider for user context
**Navigation**: Use existing navigation patterns and routing
**UI Components**: Leverage workspace UI component library
**Data Layer**: Use established ZenStack/tRPC patterns

### Future Integrations

**Item Editor**: Right panel will integrate with category selection
**Search**: Global menu search will filter categories/subcategories
**Analytics**: Track category usage and performance metrics