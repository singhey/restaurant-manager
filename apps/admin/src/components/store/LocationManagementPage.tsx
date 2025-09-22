import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { useAppForm, AppInputField } from '@workspace/ui/components/tanstack-form'
import { LoadingButton } from '@workspace/ui/components/loading-button'
import { Button } from '@workspace/ui/components/button'
import { useParams } from '@tanstack/react-router'
import { z } from 'zod'
import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string()
})

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  
  return null
}

interface LocationMarkerProps {
  position: [number, number]
  onPositionChange: (lat: number, lng: number) => void
}

function LocationMarker({ position, onPositionChange }: LocationMarkerProps) {
  const markerRef = useRef<L.Marker>(null)

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      onPositionChange(lat, lng)
    },
  })

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current
      marker.on('dragend', () => {
        const position = marker.getLatLng()
        onPositionChange(position.lat, position.lng)
      })
    }
  }, [onPositionChange])

  return (
    <Marker
      ref={markerRef}
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: () => {
          const marker = markerRef.current
          if (marker) {
            const position = marker.getLatLng()
            onPositionChange(position.lat, position.lng)
          }
        },
      }}
    />
  )
}

export function LocationManagementPage() {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/store/location' })
  const [mapPosition, setMapPosition] = useState<[number, number]>([28.6139, 77.2090]) // Default to Delhi
  const [address, setAddress] = useState<string>('')

  const form = useAppForm({
    defaultValues: {
      latitude: mapPosition[0],
      longitude: mapPosition[1],
      address: address || ''
    },
    validators: {
      onBlur: locationSchema
    },
    onSubmit: async ({ value }) => {
      // TODO: Implement API call to save location
      console.log('Location data:', value)
      console.log('Restaurant ID:', restaurantId)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
  })

  const handlePositionChange = async (lat: number, lng: number) => {
    setMapPosition([lat, lng])
    form.setFieldValue('latitude', lat)
    form.setFieldValue('longitude', lng)

    // Reverse geocoding to get address
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      if (data.display_name) {
        setAddress(data.display_name)
        form.setFieldValue('address', data.display_name)
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          handlePositionChange(latitude, longitude)
        },
        (error) => {
          console.error('Error getting current location:', error)
        }
      )
    }
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 space-y-4 sm:space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Location Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Set your restaurant's location on the map for accurate delivery and customer navigation.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Restaurant Location</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Click on the map or drag the marker to set your restaurant's precise location.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4 sm:space-y-6"
            noValidate
            aria-label="Location management form"
            role="form"
          >
            {/* Interactive Map */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                <h3 className="text-base sm:text-lg font-medium">Interactive Map</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="w-full sm:w-auto"
                  aria-describedby="current-location-description"
                >
                  Use Current Location
                </Button>
                <div id="current-location-description" className="sr-only">
                  Automatically detect and use your current location for the restaurant
                </div>
              </div>
              
              <div 
                className="h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden border"
                role="application"
                aria-label="Interactive map for setting restaurant location"
              >
                <MapContainer
                  center={mapPosition}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  keyboard={true}
                  attributionControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapController center={mapPosition} />
                  <LocationMarker
                    position={mapPosition}
                    onPositionChange={handlePositionChange}
                  />
                </MapContainer>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Click anywhere on the map or drag the marker to set your restaurant's location. 
                Use keyboard navigation with Tab and arrow keys to interact with the map.
              </p>
            </div>

            {/* Coordinate Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <form.AppField
                name="latitude"
                children={AppInputField({
                  label: 'Latitude',
                  placeholder: 'Latitude coordinate',
                  description: 'Latitude coordinate of your restaurant'
                })}
              />

              <form.AppField
                name="longitude"
                children={AppInputField({
                  label: 'Longitude',
                  placeholder: 'Longitude coordinate',
                  description: 'Longitude coordinate of your restaurant',
                })}
              />
            </div>

            {/* Address Field */}
            <form.AppField
              name="address"
              children={AppInputField({
                label: 'Address',
                placeholder: 'Restaurant address',
                description: 'Address automatically populated from coordinates'
              })}
            />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isFormSubmitting]) => (
                  <LoadingButton 
                    loading={!canSubmit || isFormSubmitting}
                    className="w-full sm:w-auto"
                    aria-describedby="location-save-button-description"
                  >
                    Save Location
                  </LoadingButton>
                )}
              />
              <div id="location-save-button-description" className="sr-only">
                Save the restaurant location coordinates and address information
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}