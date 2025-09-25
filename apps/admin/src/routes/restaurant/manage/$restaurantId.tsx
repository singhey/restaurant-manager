import { authClient } from '@/lib/auth'
import { useCurrentOrganization } from '@daveyplate/better-auth-ui'
import { createFileRoute, Outlet, useLocation, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/restaurant/manage/$restaurantId')({
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation()
  const activeOrganization = useCurrentOrganization()
  const {restaurantId} = useParams({from: '/restaurant/manage/$restaurantId'})

  useEffect(() => {
    if(activeOrganization.data?.slug !== restaurantId) {
      authClient.organization.setActive({organizationSlug: restaurantId})
    }
  }, [location])

  return <Outlet />
}
