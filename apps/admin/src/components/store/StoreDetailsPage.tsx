import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

export function StoreDetailsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Store Details</h1>
        <p className="text-muted-foreground">
          Manage your restaurant's basic information and settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update your restaurant's name, address, and other essential details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Store details form will be implemented in the next task.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}