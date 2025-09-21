import { AuthView, SignedIn } from '@daveyplate/better-auth-ui'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <SignedIn>
      <Navigate to="/restaurant/selector" replace={true}/>
    </SignedIn>
    <AuthView view="SIGN_IN" redirectTo="/restaurant/selector" />
  </>
}
