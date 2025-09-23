import { type FC, useState } from 'react';
import { useAppForm, AppInputField, AppTextareaField } from '@workspace/ui/components/tanstack-form';
import { LoadingButton } from '@workspace/ui/components/loading-button';
import { useCreateCategory, useFindManyCategory } from '@/hooks/trpc/category';
import { useParams } from '@tanstack/react-router';
import type { AddSubcategoryFormProps } from '../../../../types/menu-editor';
import { z } from 'zod';

const subcategorySchema = z.object({
  name: z.string().min(1, { message: "Subcategory name is required" })
    .max(100, { message: "Subcategory name must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-_&']+$/, { message: "Subcategory name contains invalid characters" }),
  description: z.string().max(500, { message: "Description must be less than 500 characters" })
});

/**
 * Form component for creating new subcategories
 * Implements client-side validation and ZenStack integration with parent category context
 */
export const AddSubcategoryForm: FC<AddSubcategoryFormProps> = ({ parentCategoryId, onSubmit, onCancel }) => {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/menu/edit' });
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch existing subcategories to calculate proper sort order
  const { data: existingSubcategories } = useFindManyCategory({
    where: {
      restaurantId,
      parentId: parentCategoryId,
    },
    select: {
      sortOrder: true,
    },
    orderBy: {
      sortOrder: 'desc',
    },
    take: 1,
  });

  const { mutate: createSubcategory, isPending } = useCreateCategory({
    onSuccess: (data) => {
      if (data) {
        // Clear any previous errors
        setSubmitError(null);
        
        // Call the success callback with the created subcategory data
        onSubmit({
          name: data.name,
          description: data.description || undefined,
          parentId: data.parentId!,
        });
      }
    },
    onError: (error) => {
      // Handle and display error messages
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create subcategory. Please try again.';
      setSubmitError(errorMessage);
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      description: '',
    },
    validators: {
      onBlur: subcategorySchema
    },
    onSubmit: async ({ value }) => {
      // Clear any previous errors
      setSubmitError(null);

      // Calculate the next sort order based on existing subcategories
      const maxSortOrder = existingSubcategories?.[0]?.sortOrder || 0;
      const sortOrder = maxSortOrder + 1;

      createSubcategory({
        data: {
          name: value.name.trim(),
          description: value.description?.trim() || null,
          restaurantId,
          sortOrder,
          isActive: true,
          parentId: parentCategoryId,
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
      noValidate
      aria-label="Add new subcategory form"
    >
      {/* Error Display */}
      {submitError && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {submitError}
        </div>
      )}

      {/* Subcategory Name Field */}
      <form.AppField
        name="name"
        children={AppInputField({
          label: 'Subcategory Name',
          placeholder: 'Enter subcategory name',
          description: 'A descriptive name for your menu subcategory',
        })}
      />

      {/* Subcategory Description Field */}
      <form.AppField
        name="description"
        children={AppTextareaField({
          label: 'Description (Optional)',
          placeholder: 'Enter subcategory description',
          description: 'A brief description of what items belong in this subcategory',
        })}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isFormSubmitting]) => (
            <>
              <button
                type="button"
                onClick={onCancel}
                disabled={isFormSubmitting || isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <LoadingButton loading={!canSubmit || isFormSubmitting || isPending}>
                Create Subcategory
              </LoadingButton>
            </>
          )}
        />
      </div>
    </form>
  );
};