import { SignedIn } from '@daveyplate/better-auth-ui'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/$restaurantId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignedIn>
    <Outlet />
  </SignedIn>
}