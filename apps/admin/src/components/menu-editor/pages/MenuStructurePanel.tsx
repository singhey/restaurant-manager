import { Button } from '@workspace/ui/components/button'
import { useDeleteCategory, useFindManyCategory, useUpdateCategory } from '@workspace/db/hooks/trpc/category'
import { AddCategoryForm } from '../components/forms/AddCategoryForm'
import type { MenuStructurePanelProps } from '../../../types/menu-editor'
import { useParams } from '@tanstack/react-router'
import LoadingWrapper from '@/components/loading/loading-wrapper'
import CategoryRow from '../components/items/CategoryRow'
import { Confirm } from '@/components/generic/Confirm'
import { Modal } from '@/components/generic/Modal'

/**
 * Left panel component containing the hierarchical menu structure
 * Displays categories and subcategories with add/delete functionality
 */


export function MenuStructurePanel({ }: MenuStructurePanelProps) {
  const { restaurantId } = useParams({ strict: false })
  const { data: categories, isLoading } = useFindManyCategory({
    where: {
      restaurantId,
      parentId: null
    },
    include: {
      children: {
        include: {
          menuItems: true
        },

      }
    }
  })

  const { mutate: updateCategory } = useUpdateCategory()
  const { mutate: deleteCategory } = useDeleteCategory()

  return <div className='w-full h-full border-r'>
    <div className='p-4'>
      <Button className='w-full' variant={"outline"} onClick={() => Modal.call({
        title: "Add Category",
        description: "Add a category item in your menu",
        dialogContent: <AddCategoryForm onSubmit={() => Modal.end(true)} onCancel={() => Modal.end(false)} />
      })}> Add Category </Button>
    </div>
    <LoadingWrapper
      results={categories}
      loading={isLoading}
      render={(results) => <div className='w-full'>
        {results.map(category => <CategoryRow
          key={category.id}
          category={category}
          onEdit={(id, newName) => updateCategory({
            data: {
              name: newName
            },
            where: {
              id
            }
          })}
          onDelete={async (id) => {
            console.log("delete")
            if (await Confirm.call({
              title: 'Confirm Delete',
              description: 'Do you wish to delete the category. This action cannot be undone.'
            })) {
              deleteCategory({
                where: {
                  id
                }
              })
            }
          }}
        />
        )
        }</div>}
    />
  </div>
}