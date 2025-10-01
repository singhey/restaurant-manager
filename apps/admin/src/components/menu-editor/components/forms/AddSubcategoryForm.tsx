import { type FC, useState } from 'react';
import { useAppForm, AppInputField, AppTextareaField } from '@workspace/ui/components/tanstack-form';
import { LoadingButton } from '@workspace/ui/components/loading-button';
import { useCreateCategory } from '@workspace/db/hooks/trpc/category';
import { useParams } from '@tanstack/react-router';
import type { AddSubcategoryFormProps } from '../../../../types/menu-editor';
import { z } from 'zod';
import { Button } from '@workspace/ui/components/button';

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

  const { mutate: createSubcategory, isPending } = useCreateCategory();

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

      createSubcategory({
        data: {
          name: value.name.trim(),
          description: value.description?.trim() || null,
          restaurantId,
          isActive: true,
          parentId: parentCategoryId,
        },
      }, {
        onSuccess: () => {
          onSubmit({
            name: value.name.trim(),
            parentId: parentCategoryId
          })
        }
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
        <Button variant={"ghost"} onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={() => (
              <LoadingButton loading={isPending}>
                Create Subcategory
              </LoadingButton>
          )}
        />
      </div>
    </form>
  );
};