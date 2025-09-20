import { RedirectToSignIn, SignedIn } from '@daveyplate/better-auth-ui'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/$restaurantId')({
  component: RouteComponent,
})

function RouteComponent() {
  console.log("Is protected route")
  return <>
    <RedirectToSignIn />
    <SignedIn>
      <Outlet />
    </SignedIn>
  </>
}