import { AccountSettingsCards, AccountView } from '@daveyplate/better-auth-ui'
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
  </div>
}
