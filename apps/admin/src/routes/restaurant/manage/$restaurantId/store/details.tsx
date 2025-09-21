import { createFileRoute } from '@tanstack/react-router'
import { StoreDetailsPage } from '@/components/store/StoreDetailsPage'

export const Route = createFileRoute('/restaurant/manage/$restaurantId/store/details')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StoreDetailsPage />
}