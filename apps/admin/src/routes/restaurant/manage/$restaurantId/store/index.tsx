import { createFileRoute, Navigate, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/manage/$restaurantId/store/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { restaurantId } = useParams({from: '/restaurant/manage/$restaurantId/store/'})
  // Redirect to details page as the default view
  return <Navigate to="/restaurant/manage/$restaurantId/store/details" params={{restaurantId}} />
}
