import { AccountSettingsCards, AccountView, OrganizationSettingsCards } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/account/restaurants')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <AccountView 
      view='ORGANIZATIONS' 
      localization={{
        CREATE_ORGANIZATION: 'Create Restaurant'
      }}
    
    />
    <div className='pl-0 md:pl-60 lg:pl-72'>
      <h2 className='py-16 text-2xl font-bold'>Manage Current Organization </h2>
      <OrganizationSettingsCards />
    </div>
  </div>
}
