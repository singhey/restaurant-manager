import { AuthView, UserView } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/account/me')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <UserView />
  </div>
}
