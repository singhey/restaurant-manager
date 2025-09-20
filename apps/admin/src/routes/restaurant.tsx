import { RedirectToSignIn, SignedIn } from '@daveyplate/better-auth-ui'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <RedirectToSignIn />
    <SignedIn>
      <Outlet />
    </SignedIn>
  </>
}
