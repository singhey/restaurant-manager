import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

export function LocationManagementPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Location Management</h1>
        <p className="text-muted-foreground">
          Set your restaurant's location on the map for accurate delivery and customer navigation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Location</CardTitle>
          <CardDescription>
            Click on the map or drag the marker to set your restaurant's precise location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Interactive map will be implemented in the next task.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}