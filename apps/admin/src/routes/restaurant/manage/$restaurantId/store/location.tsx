import { createFileRoute } from '@tanstack/react-router'
import { LocationManagementPage } from '@/components/store/LocationManagementPage'

export const Route = createFileRoute('/restaurant/manage/$restaurantId/store/location')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LocationManagementPage />
}