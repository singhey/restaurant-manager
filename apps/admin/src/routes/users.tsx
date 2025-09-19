import { createFileRoute } from '@tanstack/react-router'

function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage all users in the system
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p>This is the main users page. The "Users" navigation item should be highlighted.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Navigate to /users/create to see child highlighting behavior.
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/users')({
  component: UsersPage,
})