import { useFindManyCategory } from './trpc/category';
import type { CategoryWithSubcategories, SubcategoryWithItems } from '../types/menu-editor';

/**
 * Custom hook for fetching category data with proper hierarchy and item counts
 * Handles loading and error states for category data
 */
export function useCategoryData(restaurantId?: string) {
  const {
    data: rawCategories,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useFindManyCategory(
    {
      where: {
        restaurantId: restaurantId || 'placeholder-restaurant-id', // TODO: Get from auth context
        parentId: null, // Only fetch root categories
        isActive: true,
      },
      include: {
        children: {
          where: {
            isActive: true,
          },
          include: {
            _count: {
              select: {
                children: true,
                menuItems: true
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        },
        _count: {
          select: {
            children: true,
            menuItems: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    },
    {
      enabled: !!restaurantId, // Only fetch when restaurantId is available
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    }
  );

  // Transform the data to match our TypeScript interfaces
  const categories: CategoryWithSubcategories[] = rawCategories?.map(category => {
    const transformedCategory: CategoryWithSubcategories = {
      ...category,
      description: category.description ?? undefined, // Convert null to undefined
      parentId: category.parentId ?? undefined, // Convert null to undefined
      children: category.children?.map(child => {
        const transformedChild: SubcategoryWithItems = {
          ...child,
          description: child.description ?? undefined, // Convert null to undefined
          parentId: child.parentId ?? undefined, // Convert null to undefined
          menuItems: [], // We don't need the full menu items, just the count
          _count: {
            children: child._count?.children || 0,
            menuItems: child._count?.menuItems || 0
          }
        };
        return transformedChild;
      }) || [],
      _count: {
        children: category._count?.children || 0,
        menuItems: category._count?.menuItems || 0
      }
    };
    return transformedCategory;
  }) || [];

  return {
    categories,
    isLoading,
    error,
    refetch,
    isRefetching,
    // Computed values for convenience
    hasCategories: categories.length > 0,
    totalCategories: categories.length,
    totalSubcategories: categories.reduce((sum, cat) => sum + cat._count.children, 0),
  };
}

/**
 * Hook for getting a specific category by ID
 */
export function useCategoryById(categoryId: string, restaurantId?: string) {
  const { categories, isLoading, error } = useCategoryData(restaurantId);

  const category = categories.find(cat => cat.id === categoryId);
  const subcategory = categories
    .flatMap(cat => cat.children)
    .find(subcat => subcat.id === categoryId);

  return {
    category: category || subcategory,
    isCategory: !!category,
    isSubcategory: !!subcategory,
    parentCategory: subcategory ? categories.find(cat =>
      cat.children.some(child => child.id === categoryId)
    ) : undefined,
    isLoading,
    error,
  };
}