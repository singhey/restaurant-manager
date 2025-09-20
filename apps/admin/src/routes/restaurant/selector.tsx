import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { OrganizationSettingsCards } from '@daveyplate/better-auth-ui'
import { authClient } from '@/lib/auth'

export const Route = createFileRoute('/restaurant/selector')({
  component: RouteComponent,
})

function RouteComponent() {

  const {data} = authClient.useListOrganizations()
  const navigate = useNavigate()

  console.log(data?.length)
  if(data?.length === 0) {
    navigate({to: `/restaurant/create`, replace: true})
  }

  return <OrganizationSettingsCards />

}
