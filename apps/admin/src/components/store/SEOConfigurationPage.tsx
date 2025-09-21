import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

export function SEOConfigurationPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">SEO Configuration</h1>
        <p className="text-muted-foreground">
          Configure search engine optimization settings for your restaurant.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Engine Optimization</CardTitle>
          <CardDescription>
            Set up meta tags, analytics, and tracking codes to improve your online presence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            SEO configuration form will be implemented in the next task.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}