import { createFileRoute } from '@tanstack/react-router'

function CreateUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create User</h1>
        <p className="text-muted-foreground">
          Add a new user to the system
        </p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-2">User Creation Form</h2>
          <p>This is the create user page. Both "Users" parent and "Create User" child should be highlighted.</p>
          <p className="text-sm text-muted-foreground mt-2">
            The parent "Users" menu should be expanded and both items should show active states.
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/restaurant/$restaurantId/users/create')({
  component: CreateUserPage,
})