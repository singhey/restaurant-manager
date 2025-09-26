import { useState } from 'react'
import { useAppForm, AppInputField, AppTextareaField } from '@workspace/ui/components/tanstack-form'
import { LoadingButton } from '@workspace/ui/components/loading-button'
import { useCreateCategory } from '@workspace/db/hooks/trpc/category'
import { useParams } from '@tanstack/react-router'
import type { AddCategoryFormProps } from '../../../../types/menu-editor'
import {z} from 'zod'
import { Button } from '@workspace/ui/components/button'


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
    onSuccess: (data: any) => {
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
    onError: (error: any) => {
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
        <Button variant={"secondary"} onClick={onCancel}>Cancel</Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={() => (
            <>
              <LoadingButton loading={isPending}>
                Create Category
              </LoadingButton>
            </>
          )}
        />
      </div>
    </form>
  )
}