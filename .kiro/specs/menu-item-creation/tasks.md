# Implementation Plan

- [x] 1. Enhance data types and interfaces for menu items
  - Extend existing menu-editor types to include menu item interfaces and form data types
  - Add MenuItemRow, ItemEditorPanel, and MenuItemForm component prop interfaces
  - Create state management interfaces for right panel and subcategory expansion
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 2. Create menu item display components
  - [x] 2.1 Build MenuItemRow component
    - Create component to display individual menu items with name, price, and active status
    - Add click handler for selecting menu item for editing
    - Implement active/inactive visual states with proper styling
    - Add delete button with confirmation dialog integration
    - _Requirements: 1.3, 4.1, 5.1, 7.1_

  - [x] 2.2 Implement drag-and-drop for menu items
    - Make MenuItemRow draggable using @dnd-kit/sortable
    - Add drag handle and visual feedback during drag operations
    - Implement drop zones for reordering within same subcategory
    - Disable drag functionality when alphabetical sorting is active
    - _Requirements: 6.1, 6.2, 6.4_

- [x] 3. Enhance SubcategoryItem component for menu item display





  - [x] 3.1 Add expansion functionality to SubcategoryItem


    - Add expand/collapse toggle button next to subcategory name
    - Implement visual indicators for expandable subcategories
    - Add state management for expanded/collapsed state
    - Persist expansion state in localStorage
    - _Requirements: 1.1, 1.2, 1.4_



  - [ ] 3.2 Integrate menu item list display




    - Add MenuItemRow components when subcategory is expanded
    - Implement proper nesting and indentation for menu items
    - Add loading states for menu item data fetching
    - Handle empty state when subcategory has no menu items


    - _Requirements: 1.3, 1.4_

  - [ ] 3.3 Add menu item creation button
    - Add "+" button that appears on subcategory hover
    - Implement click handler to trigger right panel form
    - Add proper styling and positioning for the add button
    - Integrate with right panel state management
    - _Requirements: 2.1, 2.2_

- [ ] 4. Create right panel menu item editor
  - [ ] 4.1 Build ItemEditorPanel component
    - Create main right panel component with empty, create, and edit states
    - Implement state management for selected menu item and subcategory
    - Add proper layout and styling consistent with existing design
    - Handle state transitions between different panel modes
    - _Requirements: 3.1, 4.1_

  - [ ] 4.2 Implement MenuItemForm component
    - Create form component with name, description, price, and active status fields
    - Implement client-side validation using react-hook-form and zod
    - Add proper form styling and error message display
    - Handle both create and edit modes with appropriate field pre-population
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.2_

  - [ ] 4.3 Add form submission and validation
    - Integrate useCreateMenuItem hook for new menu item creation
    - Integrate useUpdateMenuItem hook for existing menu item updates
    - Implement proper error handling and success feedback
    - Add form reset and cleanup after successful operations
    - _Requirements: 2.3, 3.5, 4.3, 8.2, 8.3_

- [ ] 5. Implement menu item CRUD operations
  - [ ] 5.1 Add menu item creation functionality
    - Implement create menu item handler using useCreateMenuItem hook
    - Add proper data validation and error handling
    - Update subcategory display after successful creation
    - Add success toast notifications and form cleanup
    - _Requirements: 2.2, 2.3, 2.4, 8.1, 8.2_

  - [ ] 5.2 Implement menu item editing functionality
    - Add menu item selection handler for editing mode
    - Pre-populate form fields with existing menu item data
    - Implement update functionality using useUpdateMenuItem hook
    - Handle optimistic updates and error rollback
    - _Requirements: 4.1, 4.2, 4.3, 8.3_

  - [ ] 5.3 Add menu item deletion functionality
    - Create delete confirmation dialog component
    - Implement delete handler using useDeleteMenuItem hook
    - Add proper error handling and success feedback
    - Update subcategory display after successful deletion
    - _Requirements: 5.1, 5.2, 5.3, 8.4_

- [ ] 6. Implement menu item status toggle functionality
  - Create toggle handler for menu item active/inactive status
  - Implement immediate UI feedback with optimistic updates
  - Use useUpdateMenuItem hook to persist status changes
  - Add visual indicators for inactive menu items (dimmed/strikethrough)
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 7. Enhance data fetching to include menu items
  - [ ] 7.1 Update useCategoryData hook for menu items
    - Modify existing query to include menu items in subcategories
    - Add proper TypeScript types for menu item data
    - Implement sorting logic for menu items (manual vs alphabetical)
    - Handle loading and error states for menu item data
    - _Requirements: 1.1, 1.3, 6.4, 8.1_

  - [ ] 7.2 Add subcategory expansion state management
    - Create useSubcategoryExpansion hook for managing expanded states
    - Implement localStorage persistence for expansion preferences
    - Add utility functions for expansion state operations
    - Integrate with SubcategoryItem component
    - _Requirements: 1.2, 1.4_

- [ ] 8. Enhance drag-and-drop provider for menu items
  - [ ] 8.1 Extend DragDropProvider for menu item support
    - Add menu item drag data types and handlers
    - Implement collision detection for menu item reordering
    - Add visual feedback and drag overlay for menu items
    - Ensure proper integration with existing category/subcategory dragging
    - _Requirements: 6.1, 6.2_

  - [ ] 8.2 Implement menu item reordering logic
    - Add menu item reorder handler with sortOrder updates
    - Implement proper sort order calculation for dropped items
    - Add validation to prevent cross-subcategory menu item moves
    - Handle reordering when alphabetical sorting is disabled
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 9. Add comprehensive error handling and user feedback
  - [ ] 9.1 Implement menu item operation error handling
    - Add error boundaries for menu item components
    - Handle ZenStack hook errors with user-friendly messages
    - Implement retry mechanisms for failed menu item operations
    - Add fallback UI for menu item error states
    - _Requirements: 8.5_

  - [ ] 9.2 Add loading states and success feedback
    - Implement loading spinners for menu item operations
    - Add toast notifications for successful menu item operations
    - Show optimistic updates with rollback on failures
    - Add proper loading states for drag-and-drop operations
    - _Requirements: 2.4, 3.5, 4.3, 5.3_

- [ ] 10. Implement responsive design and accessibility
  - [ ] 10.1 Add responsive layout for menu items
    - Ensure proper responsive behavior for menu item display
    - Implement touch-friendly interactions for mobile devices
    - Add appropriate touch target sizes for menu item interactions
    - Test and optimize menu item display for various screen sizes
    - _Requirements: 6.2_

  - [ ] 10.2 Implement accessibility features for menu items
    - Add proper ARIA labels and roles for menu item elements
    - Implement keyboard navigation for menu item selection and editing
    - Add screen reader announcements for menu item operations
    - Ensure proper focus management in right panel forms
    - _Requirements: 1.3, 2.1, 3.1, 4.1_

- [ ] 11. Add performance optimizations
  - [ ] 11.1 Optimize menu item rendering performance
    - Add React.memo to prevent unnecessary menu item re-renders
    - Implement proper dependency arrays for menu item hooks
    - Add virtualization for subcategories with many menu items (if needed)
    - Optimize drag-and-drop performance for large menu item lists
    - _Requirements: 1.3, 6.2_

  - [ ] 11.2 Implement efficient data loading
    - Add lazy loading for menu items when subcategories are expanded
    - Implement proper caching strategy for menu item data
    - Add debouncing for menu item search and filter operations
    - Optimize query invalidation for menu item operations
    - _Requirements: 1.1, 1.2_

- [ ] 12. Write comprehensive tests for menu item functionality
  - [ ] 12.1 Create unit tests for menu item components
    - Write tests for MenuItemRow component interactions
    - Add tests for MenuItemForm validation and submission
    - Test ItemEditorPanel state management and transitions
    - Add tests for subcategory expansion functionality
    - _Requirements: 1.3, 2.4, 3.4, 4.3_

  - [ ] 12.2 Add integration tests for menu item workflows
    - Create tests for complete menu item creation flow
    - Add tests for menu item editing and updating workflows
    - Test drag-and-drop reordering scenarios for menu items
    - Add tests for menu item deletion and status toggle operations
    - _Requirements: 5.3, 6.3, 7.4_

- [ ] 13. Final integration and polish
  - [ ] 13.1 Integrate menu item features with existing menu editor
    - Ensure seamless integration with existing category/subcategory functionality
    - Test compatibility with existing drag-and-drop operations
    - Verify proper integration with sorting preferences
    - Add proper TypeScript documentation for new components
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 13.2 Add final polish and documentation
    - Implement proper component documentation and usage examples
    - Add inline code comments for complex menu item logic
    - Perform final testing and bug fixes for menu item functionality
    - Create user documentation for menu item management features
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_
