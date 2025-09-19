import { createFileRoute } from '@tanstack/react-router'

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure application settings
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-2">Application Settings</h2>
          <p>This is the settings page. Only the "Settings" navigation item should be highlighted.</p>
          <p className="text-sm text-muted-foreground mt-2">
            This tests single-level navigation highlighting.
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})