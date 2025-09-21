import { createFileRoute } from '@tanstack/react-router'
import { MenuEditPage } from '@/components/menu-editor/MenuEditPage'

export const Route = createFileRoute('/restaurant/manage/$restaurantId/menu/edit')({
  component: MenuEditPage,
})