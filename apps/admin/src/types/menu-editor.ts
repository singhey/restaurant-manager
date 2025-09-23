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

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
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
}

export interface SubcategoryItemProps {
  subcategory: SubcategoryWithItems;
  onDelete: (subcategoryId: string) => void;
  onReorder: (subcategoryId: string, newOrder: number, newParentId?: string) => void;
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

// Drag and drop types
export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current?: {
        type: 'category' | 'subcategory';
        category?: CategoryWithSubcategories;
        subcategory?: SubcategoryWithItems;
      };
    };
  };
  over: {
    id: string;
    data: {
      current?: {
        type: 'category' | 'subcategory';
        accepts?: ('category' | 'subcategory')[];
      };
    };
  } | null;
}

// State management types
export interface MenuEditorState {
  expandedCategories: string[];
  selectedItem?: string;
  isLoading: boolean;
  error?: string;
}

export interface ExpandedStatesStorage {
  [categoryId: string]: boolean;
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