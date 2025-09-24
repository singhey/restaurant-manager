// @ts-nocheck
import type { MenuItem } from "@zenstackhq/runtime/models"
// Core data types based on ZenStack schema
export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  parentId?: string;
  children?: Category[];
  menuItems?: MenuItem[];
  _count?: {
    children: number;
    menuItems: number;
  };
}

// Extended types for component usage
export interface CategoryWithSubcategories extends Omit<Category, 'children' | '_count'> {
  children: SubcategoryWithItems[];
  _count: {
    children: number;
    menuItems: number;
  };
}

export interface SubcategoryWithItems extends Omit<Category, 'menuItems' | '_count'> {
  menuItems: MenuItem[];
  _count: {
    children: number;
    menuItems: number;
  };
}

// Form data types
export interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: string;
}

export interface CreateSubcategoryData {
  name: string;
  description?: string;
  parentId: string;
}

export interface CreateMenuItemData {
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryId: string; // Subcategory ID
}

export interface UpdateMenuItemData {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  sortOrder?: number;
}

// Component prop interfaces
export interface MenuStructurePanelProps {
  onItemSelect?: (itemId: string) => void;
}

export interface CategoryItemProps {
  category: CategoryWithSubcategories;
  isExpanded: boolean;
  onToggleExpanded: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onReorder: (categoryId: string, newOrder: number) => void;
  onSubcategoryReorder: (subcategoryId: string, newOrder: number, newParentId?: string) => void;
  onMenuItemSelect?: (menuItem: MenuItem) => void;
  onMenuItemAdd?: (subcategoryId: string) => void;
}

export interface SubcategoryItemProps {
  subcategory: SubcategoryWithItems;
  isExpanded: boolean;
  onToggleExpanded: (subcategoryId: string) => void;
  onDelete: (subcategoryId: string) => void;
  onReorder: (subcategoryId: string, newOrder: number, newParentId?: string) => void;
  onMenuItemSelect: (menuItem: MenuItem) => void;
  onMenuItemAdd: (subcategoryId: string) => void;
  isLoadingMenuItems?: boolean;
}

export interface AddCategoryFormProps {
  onSubmit: (data: CreateCategoryData) => void;
  onCancel: () => void;
}

export interface AddSubcategoryFormProps {
  parentCategoryId: string;
  onSubmit: (data: CreateSubcategoryData) => void;
  onCancel: () => void;
}

// Menu item component prop interfaces
export interface MenuItemRowProps {
  menuItem: MenuItem;
  onSelect: (menuItem: MenuItem) => void;
  onDelete: (menuItemId: string) => void;
  onToggleActive: (menuItemId: string, isActive: boolean) => void;
  onReorder: (menuItemId: string, newOrder: number) => void;
  isSelected: boolean;
}

export interface ItemEditorPanelProps {
  selectedMenuItem?: MenuItem;
  selectedSubcategoryId?: string;
  onMenuItemSave: (menuItem: MenuItem) => void;
  onMenuItemCreate: (data: CreateMenuItemData, subcategoryId: string) => void;
  onClearSelection: () => void;
}

export interface MenuItemFormProps {
  menuItem?: MenuItem; // For editing existing items
  subcategoryId?: string; // For creating new items
  onSubmit: (data: CreateMenuItemData | UpdateMenuItemData) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

// Drag and drop types
export interface MenuItemDragData {
  type: 'menuItem';
  id: string;
  subcategoryId: string;
  name: string;
  sortOrder: number;
}

export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current?: {
        type: 'category' | 'subcategory' | 'menuItem';
        category?: CategoryWithSubcategories;
        subcategory?: SubcategoryWithItems;
        menuItem?: MenuItemDragData;
      };
    };
  };
  over: {
    id: string;
    data: {
      current?: {
        type: 'category' | 'subcategory' | 'menuItem';
        accepts?: ('category' | 'subcategory' | 'menuItem')[];
      };
    };
  } | null;
}

// State management types
export interface MenuEditorState {
  expandedCategories: string[];
  expandedSubcategories: string[];
  selectedItem?: string;
  isLoading: boolean;
  error?: string;
}

export interface ExpandedStatesStorage {
  [categoryId: string]: boolean;
}

// Right panel state management
export interface RightPanelState {
  mode: 'empty' | 'create' | 'edit';
  selectedMenuItem?: MenuItem;
  selectedSubcategoryId?: string;
  isFormDirty: boolean;
}

export interface RightPanelStateHook {
  mode: 'empty' | 'create' | 'edit';
  selectedMenuItem?: MenuItem;
  selectedSubcategoryId?: string;
  isFormDirty: boolean;
  selectMenuItemForEdit: (menuItem: MenuItem) => void;
  selectSubcategoryForCreate: (subcategoryId: string) => void;
  clearSelection: () => void;
  setFormDirty: (dirty: boolean) => void;
}

// Subcategory expansion state management
export interface SubcategoryExpansionState {
  expandedSubcategories: string[];
  toggleSubcategoryExpanded: (subcategoryId: string) => void;
  isSubcategoryExpanded: (subcategoryId: string) => boolean;
}

// Sorting preference types
export type SortingMode = 'manual' | 'alphabetical';

export interface SortingPreference {
  mode: SortingMode;
  isAlphabeticalSort: boolean;
}

export interface SortingPreferenceHook {
  isAlphabeticalSort: boolean;
  sortingMode: SortingMode;
  setSortingMode: (mode: SortingMode) => void;
  toggleSortingMode: () => void;
  resetToDefault: () => void;
}