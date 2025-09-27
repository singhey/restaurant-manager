import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/restaurant/manage/$restaurantId/orders/online',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/restaurant/manage/$restaurantId/orders/online"!</div>
}
