import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/restaurant/add"!</div>
}
