import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Building2, MapPin, Plus } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/restaurant/selector')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: organizations, isPending: orgsLoading, error } = authClient.useListOrganizations()
  const navigate = useNavigate()


  // Auto-redirect if no organizations
  useEffect(() => {
    if (!orgsLoading && organizations?.length === 0) {
      navigate({ to: '/restaurant/create', replace: true })
    }
  }, [organizations, orgsLoading, navigate])

  if (orgsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Select Your Restaurant</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Restaurants</h1>
          <p className="text-gray-600 mb-6">We couldn't load your restaurants. Please try again.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Restaurants are already fetched with organization data included

  const handleRestaurantSelect = (id: string) => {
    navigate({ to: `/restaurant/manage/${id}` })
  }

  const handleAddRestaurant = () => {
    navigate({ to: '/restaurant/create' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Your Restaurant</h1>
          <p className="text-gray-600">Choose a restaurant to manage or create a new one</p>
        </div>

        {organizations && organizations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {organizations.map((organization) => (
              <Card
                key={organization.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 hover:border-primary/20"
                onClick={() => handleRestaurantSelect(organization.slug)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {organization.logo || organization.logo ? (
                        <img
                          src={organization.logo || organization?.logo || ''}
                          alt={organization.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 truncate">{organization.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{organization.name}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        {/* @ts-ignore */}
                        <span className="truncate">{organization.address}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Restaurants Found</h2>
            <p className="text-gray-600 mb-6">You don't have any restaurants yet. Create your first one to get started.</p>
          </div>
        )}

        <div className="text-center">
          <Button onClick={handleAddRestaurant} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Restaurant
          </Button>
        </div>
      </div>
    </div>
  )
}
