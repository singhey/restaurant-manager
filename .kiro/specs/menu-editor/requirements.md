# Requirements Document

## Introduction

The menu editor feature provides restaurant administrators with a comprehensive interface to manage their menu structure through categories, subcategories, and items. The feature will be accessible at the `/menu/edit` route and will initially focus on category and subcategory management with drag-and-drop reordering capabilities. The interface follows a two-panel layout with the menu structure on the left and item details editor on the right.

## Requirements

### Requirement 1

**User Story:** As a restaurant administrator, I want to view all menu categories in a hierarchical structure, so that I can understand the current menu organization.

#### Acceptance Criteria

1. WHEN the user navigates to `/menu/edit` THEN the system SHALL display all existing categories in the left panel
2. WHEN categories contain subcategories THEN the system SHALL display them in a nested, expandable format
3. WHEN subcategories contain items THEN the system SHALL show the item count for each subcategory
4. WHEN a category is expanded THEN the system SHALL show all its subcategories with their respective item counts

### Requirement 2

**User Story:** As a restaurant administrator, I want to add new categories to my menu, so that I can organize menu items effectively.

#### Acceptance Criteria

1. WHEN the user clicks "Add Category" THEN the system SHALL display a form to create a new category
2. WHEN the user submits a valid category name THEN the system SHALL create the category and add it to the menu structure
3. WHEN the category creation is successful THEN the system SHALL display the new category in the left panel
4. IF the category name is empty or invalid THEN the system SHALL display appropriate validation errors

### Requirement 3

**User Story:** As a restaurant administrator, I want to add subcategories to existing categories, so that I can further organize menu items within categories.

#### Acceptance Criteria

1. WHEN the user clicks "Add Subcategory" for a category THEN the system SHALL display a form to create a new subcategory
2. WHEN the user submits a valid subcategory name THEN the system SHALL create the subcategory under the selected category
3. WHEN the subcategory creation is successful THEN the system SHALL display the new subcategory nested under its parent category
4. IF the subcategory name is empty or invalid THEN the system SHALL display appropriate validation errors

### Requirement 4

**User Story:** As a restaurant administrator, I want to delete categories and subcategories, so that I can remove outdated or unnecessary menu sections.

#### Acceptance Criteria

1. WHEN the user clicks delete on a category THEN the system SHALL prompt for confirmation before deletion
2. WHEN the user confirms category deletion THEN the system SHALL remove the category and all its subcategories and items
3. WHEN the user clicks delete on a subcategory THEN the system SHALL prompt for confirmation before deletion
4. WHEN the user confirms subcategory deletion THEN the system SHALL remove the subcategory and all its items
5. IF a category or subcategory contains items THEN the system SHALL warn the user about the impact of deletion

### Requirement 5

**User Story:** As a restaurant administrator, I want to reorder categories and subcategories using drag and drop, so that I can arrange the menu structure according to my preferences.

#### Acceptance Criteria

1. WHEN the user drags a category THEN the system SHALL allow dropping it in a new position among other categories
2. WHEN the user drops a category in a new position THEN the system SHALL update the category order and persist the changes
3. WHEN the user drags a subcategory THEN the system SHALL allow dropping it in a new position within the same category or to a different category
4. WHEN the user drops a subcategory in a new position THEN the system SHALL update the subcategory order and persist the changes
5. WHEN drag and drop operations occur THEN the system SHALL provide visual feedback during the drag operation

### Requirement 8

**User Story:** As a restaurant administrator, I want to choose between manual ordering and alphabetical sorting for categories and subcategories, so that I can organize my menu structure in the way that works best for my business.

#### Acceptance Criteria

1. WHEN the user accesses the menu editor THEN the system SHALL provide a toggle option between "Manual Order" and "Alphabetical Sort"
2. WHEN "Alphabetical Sort" is selected THEN the system SHALL display all categories and subcategories in lexicographic (alphabetical) order by name
3. WHEN "Manual Order" is selected THEN the system SHALL display categories and subcategories according to their sortOrder field
4. WHEN "Alphabetical Sort" is active THEN the system SHALL disable drag-and-drop reordering functionality
5. WHEN "Manual Order" is active THEN the system SHALL enable drag-and-drop reordering functionality
6. WHEN the sorting preference is changed THEN the system SHALL persist the user's choice and maintain it across sessions

### Requirement 6

**User Story:** As a restaurant administrator, I want to expand and collapse categories, so that I can focus on specific sections of the menu structure.

#### Acceptance Criteria

1. WHEN the user clicks on a category with subcategories THEN the system SHALL toggle the expanded/collapsed state
2. WHEN a category is expanded THEN the system SHALL show all its subcategories and maintain the expanded state
3. WHEN a category is collapsed THEN the system SHALL hide all its subcategories and show only the category name with item count
4. WHEN the page is refreshed THEN the system SHALL remember the expanded/collapsed states of categories

### Requirement 7

**User Story:** As a restaurant administrator, I want all menu operations to use the existing ZenStack/tRPC backend, so that data changes are properly synchronized and validated.

#### Acceptance Criteria

1. WHEN any category operation is performed THEN the system SHALL use ZenStack hooks for network calls
2. WHEN any subcategory operation is performed THEN the system SHALL use ZenStack hooks for network calls
3. WHEN drag and drop reordering occurs THEN the system SHALL persist order changes through the tRPC backend
4. IF any network operation fails THEN the system SHALL display appropriate error messages and revert UI changes
5. WHEN operations are successful THEN the system SHALL update the UI to reflect the current backend state