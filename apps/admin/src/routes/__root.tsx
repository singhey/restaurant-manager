import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import DataProvider from '../lib/DataProvider'

const RootLayout = () => (
  <DataProvider>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
    </div>
    <hr />
    <Outlet />
  </DataProvider>
)

export const Route = createRootRoute({ component: RootLayout })