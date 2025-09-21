import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Redirect to a default restaurant - you can modify this logic
    throw redirect({
      to: '/restaurant/manage/$restaurantId',
      params: { restaurantId: 'default' }
    })
  },
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  )
}