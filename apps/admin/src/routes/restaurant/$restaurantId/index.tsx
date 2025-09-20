import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/restaurant/$restaurantId/')({
  component: RestaurantDashboard,
})

function RestaurantDashboard() {
  return (
    <div className="p-2">
      <h3>Restaurant Dashboard</h3>
      <p>Welcome to the restaurant management dashboard!</p>
    </div>
  )
}