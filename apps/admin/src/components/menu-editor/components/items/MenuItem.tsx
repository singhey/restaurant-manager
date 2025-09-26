
import { useNavigate, useParams } from '@tanstack/react-router';
import type { MenuItem } from '@workspace/db/generated/prisma/client';
import { useCreateMenuItem, useFindManyCategory, useUpdateMenuItem } from '@workspace/db/hooks/trpc';
import { Button } from '@workspace/ui/components/button';
import { AppInputField, AppMultiSelectField, AppSelectField, AppTextareaField, AppToggleGroupField, useAppForm } from '@workspace/ui/components/tanstack-form';
import { toast } from 'sonner';
import * as zod from 'zod'


const menuItemSchema = zod.object({
  name: zod.string().min(3, {message: "Dish Name must be 3 characters long"}),
  description: zod.string(),
  dishType: zod.enum(["VEG", "NON_VEG", "EGG"]),
  tax: zod.coerce.number().min(0, {message: "Tax cannot be less than 0"}).max(100, {message: "Tax cannot be more than 100"}),
  categoryId: zod.string(),
  image: zod.string().optional(),
  price: zod.coerce.number(),
  services: zod.array(zod.string())
})


export default function MenuItemAdd({menuItem}: {menuItem: MenuItem}) {
  const {restaurantId} = useParams({strict: false})
  const {mutate: createMenuItem} = useCreateMenuItem()
  const {mutate: updateMenuItem} = useUpdateMenuItem()
  const navigate = useNavigate()
  console.log(menuItem)
  const form = useAppForm({
    defaultValues: menuItem || {
      services: ['DELIVERY'],
      name: '',
      description: '',
      dishType: 'VEG',
      tax: 5,
      image: '',
      category: '',
      price: '',
    },
    validators: {
      //@ts-ignore
      onSubmit: menuItemSchema
    },
    onSubmit(data) {
      const payload = {
          name: data.value.name,
          categoryId: data.value.categoryId,
          price: parseFloat(data.value.price+""),
          restaurantId: restaurantId as string,
          image: data.value.image,
          description: data.value.description,
          services: data.value.services,
          tax: parseFloat(data.value.tax+""),
          dishType: data.value.dishType
        }
      
      if(!menuItem) {
        createMenuItem({
          data: payload,
          select: {
            id: true
          }
        }, {
          onSettled(data: any, error) {
            if(error) {
              toast.error(error.message)
            }else {
              toast.success(`Dish added successfully`)
              navigate({
                to: `/restaurant/manage/$restaurantId/menu/edit`,
                params: {restaurantId: restaurantId as string},
                search: {dish: data?.id}
              })
            }
          }
        })
      }else {
        updateMenuItem({
          data: payload,
          where: {
            id: menuItem.id
          }
        }, {
          onSettled(data, error) {
            if(error) {
              toast.error(error.message)
            }else {
              toast.success(`Dish updated successfully`)
            }
          }
        })
      }
    },
  })

  const {data: categories} = useFindManyCategory({
    where: {
      restaurantId
    }
  })

  return <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="pt-12"
      noValidate>
        <div className='p-4 space-y-10'>
      <form.AppField
        name="name"
        children={AppInputField({
          label: 'Dish Name',
          placeholder: 'Enter a descriptive name of your dish avoid spelling mistakes',
        })}
      />

      <form.AppField
        name="description"
        children={AppTextareaField({
          label: 'Dish Description',
          placeholder: 'Add details explaining your dish. Like ingredients or preparation'
        })}
      />

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField
          name="dishType"
          children={AppToggleGroupField({
            label: "Dish Type",
            toggleType: "single",
            options: [
              {value: 'VEG', label: 'Veg'},
              {value: 'NON_VEG', label: 'Non Veg'},
              {value: 'EGG', label: 'Egg'}
            ]
          })} 
        />
        <form.AppField
          name="categoryId"
          children={AppSelectField({
            label: "Category",
            options: categories? categories.map(category => ({
              label: category.name,
              value: category.id
            })) : []
          })}
          />
      </div>
      <div className='grid grid-cols-4 gap-4'>
        <div>
        <form.AppField
          name="price"
          children={AppInputField({
            label: 'Dish Cost',
            placeholder: 'Total Cost of dish',
          })}
        />
        </div>
        <form.AppField
          name="tax"
          children={AppInputField({
            label: 'Tax on Dish',
            placeholder: 'Applicabletax on dish',
          })}
        />
        <div className='col-span-2'>
          <form.AppField
          name="services"
          children={AppMultiSelectField({
            label: "Availability of dish?",
            options: [{label: "Delivery", value: "DELIVERY"}, {label: "Takeaway", value: "TAKEWAY"}, {label: "Dine In", value: "DINE_IN"}],
            variant: "default"
          })}
        />
        </div>
      </div>
      </div>
      <div className='flex justify-end w-full sticky bottom-0 border-t p-4'>
        <Button variant={"ghost"} className='text-destructive mr-12' role='button' type="button">
          Discard
        </Button>
        <form.Button className='w-'>
          {menuItem ? 'Update Dish' : 'Create Dish' }
        </form.Button>
      </div>
  </form>
}

