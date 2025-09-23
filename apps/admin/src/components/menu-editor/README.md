# Menu Editor Components

A well-organized collection of components for managing restaurant menu structure with drag-and-drop functionality.

## Directory Structure

```
menu-editor/
├── components/           # Reusable UI components
│   ├── dialogs/         # Modal dialogs
│   │   ├── DeleteCategoryDialog.tsx
│   │   └── DeleteSubcategoryDialog.tsx
│   ├── forms/           # Form components
│   │   ├── AddCategoryForm.tsx
│   │   └── AddSubcategoryForm.tsx
│   ├── items/           # List item components
│   │   ├── CategoryItem.tsx
│   │   └── SubcategoryItem.tsx
│   ├── providers/       # Context providers
│   │   └── DragDropProvider.tsx
│   └── MenuEditorErrorBoundary.tsx
├── docs/                # Documentation
│   ├── DRAG_DROP_IMPLEMENTATION.md
│   ├── IMPLEMENTATION_NOTES.md
│   ├── TASK_7_3_IMPLEMENTATION.md
│   └── VISUAL_FEEDBACK_IMPLEMENTATION.md
├── pages/               # Page-level components
│   ├── MenuEditPage.tsx
│   └── MenuStructurePanel.tsx
├── index.ts             # Main exports
└── README.md            # This file
```

## Component Overview

### Pages
- **MenuEditPage**: Main page component with two-panel layout
- **MenuStructurePanel**: Left panel containing the hierarchical menu structure

### Items
- **CategoryItem**: Individual category display with expandable subcategories
- **SubcategoryItem**: Individual subcategory display within categories

### Forms
- **AddCategoryForm**: Form for creating new categories
- **AddSubcategoryForm**: Form for creating new subcategories

### Dialogs
- **DeleteCategoryDialog**: Confirmation dialog for category deletion
- **DeleteSubcategoryDialog**: Confirmation dialog for subcategory deletion

### Providers
- **DragDropProvider**: Context provider for drag-and-drop functionality

### Components
- **MenuEditorErrorBoundary**: Error boundary for the menu editor

### UI Components
- **DropZoneIndicator**: Reusable drop zone visual indicator
- **DisabledOverlay**: Consistent disabled state overlay
- **LoadingOverlay**: Enhanced loading state with animations

## Features

### ✅ Drag and Drop
- Category reordering
- Subcategory reordering within same category
- Cross-category subcategory movement
- Visual feedback during drag operations
- Disabled when alphabetical sorting is active

### ✅ CRUD Operations
- Create categories and subcategories
- Delete with confirmation dialogs
- Update via drag-and-drop reordering

### ✅ Sorting Modes
- Manual sorting with drag-and-drop
- Alphabetical sorting (disables drag-and-drop)

### ✅ User Experience
- Expandable/collapsible categories
- Item count badges
- Loading states and error handling
- Toast notifications for user feedback
- Enhanced drag-and-drop visual feedback and animations
- Disabled state indicators for alphabetical sorting mode
- Smooth transitions and hover effects
- Accessibility-compliant interactions

## Usage

```typescript
import { MenuEditPage } from '@/components/menu-editor'

// Use in your route component
export function MenuRoute() {
  return <MenuEditPage />
}
```

## Import Structure

All components are exported from the main index file for clean imports:

```typescript
// Import specific components
import { 
  MenuEditPage, 
  CategoryItem, 
  AddCategoryForm 
} from '@/components/menu-editor'

// Or import everything
import * as MenuEditor from '@/components/menu-editor'
```

## Dependencies

- **@dnd-kit**: Drag and drop functionality
- **@workspace/ui**: UI component library
- **ZenStack**: Backend integration via tRPC hooks
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Sonner**: Toast notifications

## Development

The components are built with:
- TypeScript for type safety
- React hooks for state management
- Tailwind CSS for styling
- ZenStack hooks for backend integration
- Comprehensive error handling and loading states