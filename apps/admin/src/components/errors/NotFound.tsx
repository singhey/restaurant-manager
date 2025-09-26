import { Link, useRouter, useLocation } from '@tanstack/react-router'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Home, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react'

export function NotFound() {
  const router = useRouter()
  const location = useLocation()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.history.back()
    } else {
      router.navigate({ to: '/' })
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  // Extract potential restaurant ID from the path for better navigation
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const restaurantId = pathSegments.includes('restaurant') && pathSegments.includes('manage') 
    ? pathSegments[pathSegments.indexOf('manage') + 1] 
    : null

  const getDashboardLink = () => {
    if (restaurantId) {
      return `/restaurant/manage/${restaurantId}`
    }
    return '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current path display */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Requested path:</p>
            <Badge variant="outline" className="font-mono text-xs px-3 py-1">
              {location.pathname}
            </Badge>
          </div>

          {/* Possible reasons */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2">This might have happened because:</p>
            <ul className="space-y-1 text-left max-w-sm mx-auto">
              <li>• The page was moved or deleted</li>
              <li>• You don't have permission to access this page</li>
              <li>• There's a typo in the URL</li>
              <li>• The link you followed is outdated</li>
            </ul>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleGoBack} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Button onClick={handleRefresh} variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
            
            <Button asChild className="w-full">
              <Link to={getDashboardLink()}>
                <Home className="mr-2 h-4 w-4" />
                {restaurantId ? 'Go to Dashboard' : 'Go Home'}
              </Link>
            </Button>
          </div>
          
          {/* Help section */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Still having trouble? Try checking the navigation menu or contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}