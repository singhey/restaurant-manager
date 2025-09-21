import { createFileRoute } from '@tanstack/react-router'
import { SEOConfigurationPage } from '@/components/store/SEOConfigurationPage'

export const Route = createFileRoute('/restaurant/manage/$restaurantId/store/seo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SEOConfigurationPage />
}