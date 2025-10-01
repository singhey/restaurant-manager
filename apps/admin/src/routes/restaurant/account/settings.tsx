import { AccountView } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/account/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <AccountView 
      view='SETTINGS' 
      localization={{
        CREATE_ORGANIZATION: 'Create Restaurant'
      }}
    
    />
  </div>
}
