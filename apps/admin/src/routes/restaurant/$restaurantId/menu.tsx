import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/$restaurantId/menu')({
  component: MenuLayout,
})

function MenuLayout() {
  return (
    <div className="flex flex-col gap-4">
      <Outlet />
    </div>
  )
}