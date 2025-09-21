import { AccountView } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/account/security')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <AccountView 
      view='SECURITY' 
      localization={{
        CREATE_ORGANIZATION: 'Create Restaurant'
      }}
    
    />
  </div>
}
