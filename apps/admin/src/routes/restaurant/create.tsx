import { useCreateRestaurant } from '@workspace/db/hooks/trpc'
import { authClient } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'
import { 
  useAppForm,
  AppInputField,
  AppTextareaField
} from '@workspace/ui/components/tanstack-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/restaurant/create')({
  component: RouteComponent,
})

const organizationSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters"
  }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters long"
  }),
  slug: z.string().optional()
})

function RouteComponent() {
  const {mutate: createRestaurant} = useCreateRestaurant()
  const form = useAppForm({
    validators: {
      onChange: organizationSchema
    },
    onSubmit: async ({ value }: {value: z.infer<typeof organizationSchema>}) => {
      console.log(value)
      const organization = await authClient.organization.create({
        name: value.name,
        slug: value.slug || value.name.toLowerCase().replaceAll(' ', '-'),
        address: value.address
      })
      if(!organization.data) {
        toast.error('Unable to create restaurant')
        return
      }
      createRestaurant({
        data: {
          name: organization.data.name,
          id: organization.data.slug,
          //@ts-ignore
          address: organization.data.address
        }
      })
    }
  })

  return (
    <div className="max-w-xl w-full mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Restaurant</h1>
      
      <form onSubmit={e => {
        e.preventDefault()
        form.handleSubmit()
      }} className="space-y-4">
        
        <form.AppField 
          name="name"
          children={AppInputField({
            label: "Restaurant Name",
            placeholder: "Restaurant Name",
            description: "This name will be visible to all the users"
          })}
        />

        <form.AppField 
          name="address"
          children={AppTextareaField({
            label: "Restaurant Address",
            placeholder: "Restaurant Address",
            description: "This address will be visible to all the users"
          })}
        />

        <form.AppField 
          name="slug"
          children={AppInputField({
            label: "Restaurant Username (Optional)",
            placeholder: "Restaurant Username",
            description: "This will be a unique name for your restaurant. Imagine it like a username"
          })}
        />

        <form.AppForm>
          <form.Button className="w-full">
            Create Restaurant
          </form.Button>
        </form.AppForm>
      </form>
    </div>
  )
}
