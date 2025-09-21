import { useAppForm, AppInputField, AppTextareaField } from '@workspace/ui/components/tanstack-form'
import { LoadingButton } from '@workspace/ui/components/loading-button'
import { useCreateCategory } from '@/hooks/trpc/category'
import { useParams } from '@tanstack/react-router'
import type { AddCategoryFormProps } from '../../types/menu-editor'
import {z} from 'zod'


const categorySchema = z.object({
  name: z.string().min(3, {message: "Category must be minimum 3 characters long"}),
  description: z.string().min(3, {message: "Description must be at least 3 characters long"})
})

/**
 * Form component for creating new categories
 * Implements client-side validation and ZenStack integration
 */
export function AddCategoryForm({ }: AddCategoryFormProps) {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/menu/edit' })
  const {mutate: createCategory} = useCreateCategory()

  const form = useAppForm({
    defaultValues: {
      name: '',
      description: '',
    },
    validators: {
      onBlur: categorySchema
    },
    onSubmit: async ({ value }) => {
      
      createCategory({
        data: {
          name: value.name,
          description: value.description,
          restaurantId: restaurantId
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
            <LoadingButton loading={!canSubmit || isFormSubmitting}>
              Create Category
            </LoadingButton>
          )}
        />
      </div>
    </form>
  )
}