import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

export function DeliverySettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Delivery Settings</h1>
        <p className="text-muted-foreground">
          Configure delivery operations, pricing, and service options.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Fee Configuration</CardTitle>
            <CardDescription>
              Set up delivery charges and free delivery options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Delivery fee configuration will be implemented in the next task.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Operations</CardTitle>
            <CardDescription>
              Configure delivery radius, preparation time, and service types.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Delivery operations settings will be implemented in the next task.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}