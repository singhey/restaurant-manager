import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='w-full flex justify-center py-12'>
    <Outlet />
  </div>
}
