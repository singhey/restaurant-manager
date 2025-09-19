import { createFileRoute } from '@tanstack/react-router'

function ActiveUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Users</h1>
        <p className="text-muted-foreground">
          View all currently active users
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-2">Active Users List</h2>
          <p>This is the active users page. Both "Users" parent and "Active Users" child should be highlighted.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Test the active state highlighting for nested navigation items.
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/users/active')({
  component: ActiveUsersPage,
})