# Implementation Plan

- [x] 1. Set up project dependencies and route structure
  - Install @dnd-kit packages for drag-and-drop functionality
  - Create the `/menu/edit` route file with basic structure
  - Set up TypeScript interfaces for menu editor components
  - _Requirements: 1.1, 7.1_

- [x] 2. Create core data fetching and state management
  - [x] 2.1 Implement category data fetching hook
    - Create custom hook that uses `useFindManyCategory` with proper includes for subcategories and item counts
    - Handle loading and error states for category data
    - Implement proper TypeScript types for category hierarchy
    - _Requirements: 1.1, 1.4, 7.1, 7.2_

  - [x] 2.2 Create category state management utilities
    - Implement expand/collapse state management for categories
    - Create localStorage persistence for expanded states
    - Add utility functions for category tree operations
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 3. Build basic menu structure display components
  - [x] 3.1 Create MenuEditPage component
    - Implement main page layout with two-panel structure
    - Add proper routing integration with TanStack Router
    - Set up error boundary for the entire menu editor
    - _Requirements: 1.1, 7.4_

  - [x] 3.2 Implement MenuStructurePanel component
    - Create left panel container with proper styling
    - Add "Add Category" button with click handler
    - Implement basic category list rendering
    - _Requirements: 1.1, 2.1_

  - [x] 3.3 Build CategoryItem component
    - Create expandable category display with toggle functionality
    - Add category name, description, and item count display
    - Implement expand/collapse visual indicators
    - Add delete button with confirmation prompt
    - _Requirements: 1.1, 1.4, 4.1, 4.5, 6.1, 6.2_

  - [x] 3.4 Create SubcategoryItem component
    - Build subcategory display within expanded categories
    - Show subcategory name and item count
    - Add delete button with confirmation for subcategories
    - _Requirements: 1.1, 1.4, 4.3, 4.5_

- [ ] 4. Implement category and subcategory creation functionality
  - [x] 4.1 Build AddCategoryForm component





    - Create form with name and description fields
    - Implement client-side validation using react-hook-form
    - Add form submission handling with ZenStack `useCreateCategory` hook
    - Handle success and error states with proper user feedback
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.1, 7.4_

  - [ ] 4.2 Create AddSubcategoryForm component
    - Build subcategory creation form with parent category context
    - Implement validation for subcategory names
    - Add form submission using ZenStack hooks with proper parent relationship
    - Handle success and error feedback
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.2, 7.4_

  - [ ] 4.3 Integrate creation forms with main interface
    - Add modal or inline form display for category creation
    - Implement subcategory creation within category items
    - Add proper form state management and cleanup
    - _Requirements: 2.1, 3.1_

- [ ] 5. Implement sorting functionality with lexicographic option
  - [ ] 5.1 Install required drag-and-drop dependencies
    - Install @dnd-kit/core, @dnd-kit/sortable, and @dnd-kit/utilities packages
    - Verify package installation and TypeScript types
    - _Requirements: 5.1, 8.5_

  - [ ] 5.2 Create sorting preference management hook
    - Implement useSortingPreference hook with localStorage persistence
    - Add state management for alphabetical vs manual sorting modes
    - Create utility functions for sorting preference persistence
    - _Requirements: 8.1, 8.6_

  - [ ] 5.3 Build SortingToggle component
    - Create toggle component using Select UI component
    - Implement sorting mode switching functionality
    - Add proper labeling and accessibility attributes
    - _Requirements: 8.1, 8.6_

  - [ ] 5.4 Update useCategoryData hook for dynamic sorting
    - Modify query orderBy based on sorting preference
    - Implement lexicographic sorting for categories and subcategories
    - Ensure proper TypeScript types for sorting parameters
    - _Requirements: 8.2, 8.3_

  - [ ] 5.5 Integrate sorting toggle into MenuStructurePanel
    - Add SortingToggle component to panel header
    - Connect sorting preference to category data fetching
    - Update UI to reflect current sorting mode
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 6. Implement deletion functionality
  - [ ] 6.1 Add category deletion with confirmation
    - Create confirmation dialog component for category deletion
    - Implement `useDeleteCategory` hook integration
    - Handle cascade deletion warnings for categories with subcategories/items
    - Add proper error handling and user feedback
    - _Requirements: 4.1, 4.2, 4.5, 7.2, 7.4_

  - [ ] 6.2 Add subcategory deletion with confirmation
    - Implement subcategory deletion confirmation dialog
    - Use `useDeleteCategory` hook for subcategory removal
    - Handle deletion warnings for subcategories with items
    - Add success/error feedback
    - _Requirements: 4.3, 4.4, 4.5, 7.2, 7.4_

- [ ] 7. Implement drag-and-drop reordering functionality
  - [ ] 7.1 Set up @dnd-kit drag context and providers
    - Configure DndContext with appropriate sensors for mouse, keyboard, and touch
    - Set up collision detection and drag overlay components
    - Implement drag start, drag over, and drag end event handlers
    - Add conditional logic to disable drag-and-drop when alphabetical sorting is active
    - _Requirements: 5.1, 5.2, 5.5, 8.4, 8.5_

  - [ ] 7.2 Add category drag-and-drop reordering
    - Make CategoryItem components draggable with proper drag handles
    - Implement drop zones for category reordering
    - Add visual feedback during drag operations
    - Handle sortOrder updates using `useUpdateCategory` hook
    - Disable drag handles when alphabetical sorting is active
    - _Requirements: 5.1, 5.2, 5.5, 7.2, 8.4, 8.5_

  - [ ] 7.3 Implement subcategory drag-and-drop with cross-category support
    - Make SubcategoryItem components draggable
    - Enable dropping subcategories within same category for reordering
    - Implement cross-category subcategory movement
    - Handle both sortOrder and parentId updates for moved subcategories
    - Disable drag functionality when alphabetical sorting is active
    - _Requirements: 5.3, 5.4, 5.5, 7.2, 8.4, 8.5_

  - [ ] 7.4 Add drag-and-drop visual feedback and animations
    - Implement drag overlay with item preview
    - Add drop zone visual indicators
    - Create smooth animations for reordering
    - Add loading states during server updates
    - Show disabled state visuals when alphabetical sorting is active
    - _Requirements: 5.5, 8.4_

- [ ] 8. Add error handling and user feedback
  - [ ] 8.1 Implement comprehensive error handling
    - Add error boundaries for component-level error catching
    - Handle ZenStack hook errors with user-friendly messages
    - Implement retry mechanisms for failed network requests
    - Add fallback UI for error states
    - _Requirements: 7.4_

  - [ ] 8.2 Add success and loading feedback
    - Implement toast notifications for successful operations
    - Add loading spinners for async operations
    - Show optimistic updates with rollback on failures
    - Add proper loading states for drag-and-drop operations
    - _Requirements: 7.3, 7.4_

- [ ] 9. Implement responsive design and accessibility
  - [ ] 9.1 Add responsive layout and mobile support
    - Ensure proper responsive behavior for the two-panel layout
    - Implement touch-friendly drag-and-drop for mobile devices
    - Add appropriate touch target sizes for mobile interactions
    - Test and optimize for various screen sizes
    - _Requirements: 5.5_

  - [ ] 9.2 Implement accessibility features
    - Add proper ARIA labels and roles for all interactive elements
    - Implement keyboard navigation for all drag-and-drop operations
    - Add screen reader announcements for dynamic content changes
    - Ensure proper focus management throughout the interface
    - _Requirements: 5.5, 6.1, 6.2, 6.3_

- [ ] 10. Add performance optimizations and testing
  - [ ] 10.1 Optimize component performance
    - Add React.memo to prevent unnecessary re-renders
    - Implement proper dependency arrays for useEffect and useCallback hooks
    - Add debouncing for search and filter operations if needed
    - Optimize drag-and-drop performance for large lists
    - _Requirements: 1.1, 5.5_

  - [ ] 10.2 Write comprehensive tests
    - Create unit tests for all components using React Testing Library
    - Add integration tests for drag-and-drop functionality
    - Test error handling scenarios and edge cases
    - Add tests for form validation and submission
    - _Requirements: 2.4, 3.4, 4.5, 7.4_

- [ ] 11. Final integration and polish
  - [ ] 11.1 Integrate with existing navigation and layout
    - Ensure proper integration with existing sidebar navigation
    - Add breadcrumb navigation for the menu editor
    - Test integration with existing authentication and authorization
    - _Requirements: 7.1, 7.2_

  - [ ] 11.2 Add final polish and documentation
    - Implement proper TypeScript documentation for all components
    - Add inline code comments for complex logic
    - Create component usage examples and documentation
    - Perform final testing and bug fixes
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_
