import { useState } from 'react'
import { useAppForm, AppInputField, AppTextareaField } from '@workspace/ui/components/tanstack-form'
import { LoadingButton } from '@workspace/ui/components/loading-button'
import { useCreateCategory } from '@/hooks/trpc/category'
import { useParams } from '@tanstack/react-router'
import type { AddCategoryFormProps } from '../../../../types/menu-editor'
import {z} from 'zod'


const categorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" })
    .max(100, { message: "Category name must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-_&']+$/, { message: "Category name contains invalid characters" }),
  description: z.string().max(500, { message: "Description must be less than 500 characters" })
})

/**
 * Form component for creating new categories
 * Implements client-side validation and ZenStack integration
 */
export function AddCategoryForm({ onSubmit, onCancel }: AddCategoryFormProps) {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/menu/edit' })
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const {mutate: createCategory, isPending} = useCreateCategory({
    onSuccess: (data) => {
      if (data) {
        // Clear any previous errors
        setSubmitError(null)
        
        // Call the success callback with the created category data
        onSubmit({
          name: data.name,
          description: data.description || undefined,
        })
      }
    },
    onError: (error) => {
      // Handle and display error messages
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create category. Please try again.'
      setSubmitError(errorMessage)
    },
  })

  const form = useAppForm({
    defaultValues: {
      name: '',
      description: '',
    },
    validators: {
      onBlur: categorySchema
    },
    onSubmit: async ({ value }) => {
      // Clear any previous errors
      setSubmitError(null)
      
      createCategory({
        data: {
          name: value.name.trim(),
          description: value.description?.trim() || null,
          restaurantId: restaurantId,
          sortOrder: 0, // Will be updated by backend
          isActive: true,
        }
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
      noValidate
      aria-label="Add new category form"
    >
      {/* Error Display */}
      {submitError && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {submitError}
        </div>
      )}

      {/* Category Name Field */}
      <form.AppField
        name="name"
        children={AppInputField({
          label: 'Category Name',
          placeholder: 'Enter category name',
          description: 'A descriptive name for your menu category',
        })}
      />

      {/* Category Description Field */}
      <form.AppField
        name="description"
        children={AppTextareaField({
          label: 'Description (Optional)',
          placeholder: 'Enter category description',
          description: 'A brief description of what items belong in this category',
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
                Create Category
              </LoadingButton>
            </>
          )}
        />
      </div>
    </form>
  )
}