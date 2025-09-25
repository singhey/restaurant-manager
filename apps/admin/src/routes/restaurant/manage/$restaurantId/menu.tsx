import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/manage/$restaurantId/menu')({
  component: MenuLayout,
})

function MenuLayout() {
  return <Outlet />
}