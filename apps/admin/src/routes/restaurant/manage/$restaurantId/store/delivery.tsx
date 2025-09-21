import { createFileRoute } from '@tanstack/react-router'
import { DeliverySettingsPage } from '@/components/store/DeliverySettingsPage'

export const Route = createFileRoute('/restaurant/manage/$restaurantId/store/delivery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DeliverySettingsPage />
}