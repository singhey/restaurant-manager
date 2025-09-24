# Design Document

## Overview

The menu item creation feature extends the existing menu editor by enabling restaurant administrators to manage individual menu items (dishes) within subcategories. This feature builds upon the established two-panel layout, enhancing the left panel with expandable subcategories that display menu items, and utilizing the right panel for menu item creation and editing forms.

The design integrates seamlessly with the existing menu editor architecture, leveraging established patterns for drag-and-drop functionality, form handling, and ZenStack/tRPC backend integration. The feature maintains consistency with the current UI components and follows the same accessibility and responsive design principles.

## Architecture

### Component Structure

```
MenuEditPage (Enhanced)
├── MenuStructurePanel (Enhanced Left Panel)
│   ├── CategoryList
│   │   ├── CategoryItem
│   │   │   ├── CategoryHeader
│   │   │   ├── SubcategoryList
│   │   │   │   └── SubcategoryItem (Enhanced)
│   │   │   │       ├── SubcategoryHeader
│   │   │   │       ├── MenuItemList (New)
│   │   │   │       │   └── MenuItemRow (New)
│   │   │   │       └── AddMenuItemButton (New)
│   │   │   └── AddSubcategoryButton
│   │   └── AddCategoryButton
│   └── DragDropProvider (Enhanced)
└── ItemEditorPanel (Enhanced Right Panel)
    ├── MenuItemForm (New)
    ├── MenuItemDetails (New)
    └── EmptyState
```

### Technology Stack

- **Frontend Framework**: React with TypeScript (existing)
- **State Management**: TanStack Query with ZenStack hooks (existing)
- **UI Components**: Workspace UI components (existing)
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable (existing)
- **Form Handling**: react-hook-form with zod validation (existing pattern)
- **Styling**: Tailwind CSS (existing)
- **Backend Integration**: ZenStack hooks with tRPC (existing)

### Data Flow

1. **Menu Item Fetching**: Enhance existing `useCategoryData` hook to include menu items in subcategories
2. **Menu Item Mutations**: Use existing ZenStack hooks (`useCreateMenuItem`, `useUpdateMenuItem`, `useDeleteMenuItem`)
3. **Right Panel State**: Manage selected menu item and form state for creation/editing
4. **Optimistic Updates**: Leverage ZenStack's optimistic update capabilities for immediate UI feedback

## Components and Interfaces

### Enhanced SubcategoryItem Component

**Purpose**: Extended to display menu items and provide expansion functionality

**Enhanced Props**:
```typescript
interface SubcategoryItemProps {
  subcategory: SubcategoryWithItems;
  isExpanded: boolean; // New
  onToggleExpanded: (subcategoryId: string) => void; // New
  onDelete: (subcategoryId: string) => void;
  onReorder: (subcategoryId: string, newOrder: number, newParentId?: string) => void;
  onMenuItemSelect: (menuItem: MenuItem) => void; // New
  onMenuItemAdd: (subcategoryId: string) => void; // New
}
```

**New Features**:
- Expandable/collapsible display for menu items
- "+" button for adding new menu items
- Menu item list when expanded
- Integration with right panel selection

### MenuItemRow Component (New)

**Purpose**: Individual menu item display within expanded subcategories

**Props**:
```typescript
interface MenuItemRowProps {
  menuItem: MenuItem;
  onSelect: (menuItem: MenuItem) => void;
  onDelete: (menuItemId: string) => void;
  onToggleActive: (menuItemId: string, isActive: boolean) => void;
  onReorder: (menuItemId: string, newOrder: number) => void;
  isSelected: boolean;
}
```

**Features**:
- Display name, price, and active status
- Click to select for editing
- Toggle active/inactive status
- Delete confirmation
- Drag handle for reordering (when manual sorting is enabled)

### ItemEditorPanel Component (New)

**Purpose**: Right panel for menu item creation and editing

**Props**:
```typescript
interface ItemEditorPanelProps {
  selectedMenuItem?: MenuItem;
  selectedSubcategoryId?: string;
  onMenuItemSave: (menuItem: MenuItem) => void;
  onMenuItemCreate: (data: CreateMenuItemData, subcategoryId: string) => void;
  onClearSelection: () => void;
}
```

**States**:
- Empty state (no selection)
- Create mode (subcategory selected for new item)
- Edit mode (existing menu item selected)

### MenuItemForm Component (New)

**Purpose**: Form for creating and editing menu items

**Props**:
```typescript
interface MenuItemFormProps {
  menuItem?: MenuItem; // For editing existing items
  subcategoryId?: string; // For creating new items
  onSubmit: (data: CreateMenuItemData | UpdateMenuItemData) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}
```

**Form Fields**:
- Name (required, string, max 100 characters)
- Description (optional, string, max 500 characters)
- Price (required, number, positive value)
- Active status (boolean, default true)

**Validation**:
```typescript
const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  price: z.number().positive('Price must be greater than 0'),
  isActive: z.boolean().default(true),
});
```

## Data Models

### Enhanced MenuItem Interface

```typescript
interface MenuItem {
  id: string;
  categoryId: string; // References subcategory
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Form Data Types

```typescript
interface CreateMenuItemData {
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryId: string; // Subcategory ID
}

interface UpdateMenuItemData {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  sortOrder?: number;
}
```

### Enhanced Query Patterns

**Fetch Categories with Menu Items**:
```typescript
const { data: categories } = useFindManyCategory({
  where: {
    restaurantId: currentRestaurantId,
    parentId: null
  },
  include: {
    children: {
      include: {
        menuItems: {
          orderBy: isAlphabeticalSort ? { name: 'asc' } : { sortOrder: 'asc' }
        },
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

## State Management

### Right Panel State

```typescript
interface RightPanelState {
  mode: 'empty' | 'create' | 'edit';
  selectedMenuItem?: MenuItem;
  selectedSubcategoryId?: string;
  isFormDirty: boolean;
}

const useRightPanelState = () => {
  const [state, setState] = useState<RightPanelState>({
    mode: 'empty',
    isFormDirty: false
  });

  const selectMenuItemForEdit = (menuItem: MenuItem) => {
    setState({
      mode: 'edit',
      selectedMenuItem: menuItem,
      selectedSubcategoryId: undefined,
      isFormDirty: false
    });
  };

  const selectSubcategoryForCreate = (subcategoryId: string) => {
    setState({
      mode: 'create',
      selectedMenuItem: undefined,
      selectedSubcategoryId: subcategoryId,
      isFormDirty: false
    });
  };

  const clearSelection = () => {
    setState({
      mode: 'empty',
      selectedMenuItem: undefined,
      selectedSubcategoryId: undefined,
      isFormDirty: false
    });
  };

  return {
    ...state,
    selectMenuItemForEdit,
    selectSubcategoryForCreate,
    clearSelection,
    setFormDirty: (dirty: boolean) => setState(prev => ({ ...prev, isFormDirty: dirty }))
  };
};
```

### Subcategory Expansion State

```typescript
interface SubcategoryExpansionState {
  expandedSubcategories: string[];
  toggleSubcategoryExpanded: (subcategoryId: string) => void;
  isSubcategoryExpanded: (subcategoryId: string) => boolean;
}

const useSubcategoryExpansion = () => {
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('menu-editor-expanded-subcategories');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSubcategoryExpanded = (subcategoryId: string) => {
    setExpandedSubcategories(prev => {
      const newExpanded = prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId];
      
      localStorage.setItem('menu-editor-expanded-subcategories', JSON.stringify(newExpanded));
      return newExpanded;
    });
  };

  const isSubcategoryExpanded = (subcategoryId: string) => {
    return expandedSubcategories.includes(subcategoryId);
  };

  return {
    expandedSubcategories,
    toggleSubcategoryExpanded,
    isSubcategoryExpanded
  };
};
```

## Enhanced Drag and Drop

### Menu Item Reordering

**Drag Context Enhancement**:
- Extend existing DragDropProvider to handle menu item dragging
- Menu items can only be reordered within the same subcategory
- Disabled when alphabetical sorting is active

**Drag Data Structure**:
```typescript
interface MenuItemDragData {
  type: 'menuItem';
  id: string;
  subcategoryId: string;
  name: string;
  sortOrder: number;
}
```

**Drop Zone Logic**:
```typescript
const handleMenuItemDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  
  if (!over || active.id === over.id) return;
  
  const activeData = active.data.current as MenuItemDragData;
  const overData = over.data.current as MenuItemDragData;
  
  // Only allow reordering within the same subcategory
  if (activeData.subcategoryId !== overData.subcategoryId) {
    return;
  }
  
  // Calculate new sort order and update
  const newSortOrder = calculateNewSortOrder(activeData, overData);
  onMenuItemReorder(activeData.id, newSortOrder);
};
```

## Error Handling

### Form Validation

**Client-side Validation**:
- Real-time validation using react-hook-form and zod
- Field-level error messages
- Form submission prevention for invalid data

**Server-side Validation**:
- Handle ZenStack validation errors
- Display server error messages in form
- Graceful fallback for validation failures

### Network Error Handling

**Menu Item Operations**:
```typescript
const { mutate: createMenuItem, isPending: isCreating } = useCreateMenuItem({
  onSuccess: (newMenuItem) => {
    toast.success('Menu item created successfully');
    onMenuItemCreate(newMenuItem);
    clearSelection();
  },
  onError: (error) => {
    console.error('Failed to create menu item:', error);
    toast.error('Failed to create menu item. Please try again.');
  }
});
```

**Optimistic Updates with Rollback**:
- Immediate UI updates for better UX
- Automatic rollback on server errors
- Loading states during server operations

## User Experience Enhancements

### Visual Feedback

**Menu Item States**:
- Active items: Normal appearance
- Inactive items: Dimmed with strikethrough text
- Selected item: Highlighted background
- Dragging item: Semi-transparent with drag overlay

**Loading States**:
- Form submission: Disabled form with spinner
- Menu item operations: Loading overlay on affected subcategory
- Drag operations: Visual feedback during drag

### Keyboard Navigation

**Accessibility Features**:
- Tab navigation through menu items
- Enter key to select menu item for editing
- Escape key to cancel form operations
- Arrow keys for menu item navigation

### Mobile Responsiveness

**Touch Interactions**:
- Touch-friendly drag-and-drop for menu items
- Appropriate touch target sizes (minimum 44px)
- Swipe gestures for mobile-specific actions

**Layout Adaptations**:
- Responsive right panel behavior
- Collapsible menu item sections on small screens
- Optimized form layouts for mobile input

## Integration with Existing Systems

### Menu Editor Integration

**Left Panel Enhancements**:
- Maintain existing category/subcategory functionality
- Add menu item display and management
- Preserve drag-and-drop for categories and subcategories

**Right Panel Activation**:
- Replace placeholder content with functional item editor
- Maintain two-panel layout structure
- Integrate with existing navigation patterns

### ZenStack/tRPC Integration

**Existing Hook Usage**:
- `useCreateMenuItem` for menu item creation
- `useUpdateMenuItem` for menu item updates
- `useDeleteMenuItem` for menu item deletion
- `useFindManyMenuItem` for menu item queries (if needed)

**Query Invalidation**:
```typescript
const queryClient = useQueryClient();

const invalidateMenuData = () => {
  queryClient.invalidateQueries(['Category']);
  queryClient.invalidateQueries(['MenuItem']);
};
```

## Performance Considerations

### Data Loading Optimization

**Lazy Loading**:
- Load menu items only when subcategories are expanded
- Implement pagination for subcategories with many items
- Use React.memo for menu item components

**Caching Strategy**:
- Leverage TanStack Query caching for menu items
- Cache expansion states in localStorage
- Implement stale-while-revalidate for better UX

### Drag Performance

**Optimization Techniques**:
- Virtualization for large menu item lists (if needed)
- Throttle drag events to prevent excessive re-renders
- Optimize drag overlay rendering

## Testing Strategy

### Unit Tests

**Component Testing**:
- MenuItemRow component rendering and interactions
- MenuItemForm validation and submission
- ItemEditorPanel state management
- Subcategory expansion functionality

**Hook Testing**:
- useRightPanelState hook behavior
- useSubcategoryExpansion hook persistence
- Menu item CRUD operations

### Integration Tests

**User Workflow Testing**:
- Complete menu item creation flow
- Menu item editing and updating
- Drag-and-drop reordering scenarios
- Form validation and error handling

### E2E Tests

**Critical Path Testing**:
- Full menu item management workflow
- Cross-browser drag-and-drop compatibility
- Mobile responsiveness testing
- Accessibility compliance testing

## Security Considerations

### Data Validation

**Input Sanitization**:
- Sanitize menu item names and descriptions
- Validate price ranges and formats
- Prevent XSS through proper escaping

**Authorization**:
- Ensure menu item operations respect restaurant ownership
- Validate user permissions for menu modifications
- Implement proper CSRF protection

### Error Information Disclosure

**Safe Error Messages**:
- Avoid exposing internal system details
- Provide user-friendly error messages
- Log detailed errors server-side only