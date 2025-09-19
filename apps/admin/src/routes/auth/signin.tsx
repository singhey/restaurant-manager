import { AuthView } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <AuthView view="SIGN_IN" redirectTo='/dashboard' />
  </div>
}
