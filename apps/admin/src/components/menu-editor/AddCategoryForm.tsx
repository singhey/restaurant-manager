import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { useCreateCategory } from '../../hooks/trpc/category';
import type { AddCategoryFormProps, CreateCategoryData } from '../../types/menu-editor';

/**
 * Form component for creating new categories
 * Implements client-side validation and ZenStack integration
 */
export const AddCategoryForm: FC<AddCategoryFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCategoryData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createCategory = useCreateCategory({
    onSuccess: (data) => {
      toast.success('Category created successfully');
      reset();
      if (data) {
        onSubmit({
          name: data.name,
          description: data.description || undefined,
          parentId: data.parentId || undefined,
        });
      }
    },
    onError: (error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });

  const handleFormSubmit = async (data: CreateCategoryData) => {
    try {
      // Get the current restaurant ID (TODO: Get from auth context)
      const restaurantId = 'placeholder-restaurant-id';
      
      // Calculate the next sort order (TODO: Implement proper sort order calculation)
      const sortOrder = Date.now(); // Temporary solution
      
      await createCategory.mutateAsync({
        data: {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          restaurantId,
          sortOrder,
          isActive: true,
          parentId: data.parentId || null,
        },
      });
    } catch (error) {
      // Error is handled by the onError callback
      console.error('Category creation failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="category-name" className="text-sm font-medium">
          Category Name *
        </label>
        <Input
          id="category-name"
          {...register('name', {
            required: 'Category name is required',
            minLength: {
              value: 1,
              message: 'Category name must be at least 1 character',
            },
            maxLength: {
              value: 100,
              message: 'Category name must be less than 100 characters',
            },
            pattern: {
              value: /^[a-zA-Z0-9\s\-_&']+$/,
              message: 'Category name contains invalid characters',
            },
          })}
          placeholder="Enter category name"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="category-description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="category-description"
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'Description must be less than 500 characters',
            },
          })}
          placeholder="Enter category description (optional)"
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && (
          <p className="text-sm text-destructive" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};