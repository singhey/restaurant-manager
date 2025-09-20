import { type ReactNode } from 'react'
import { useRestaurantRoute } from '../../hooks/useRestaurantRoute'

interface RestaurantRouteWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Component that conditionally renders children only when the URL starts with '/restaurant'
 * @param children - Content to render when on a restaurant route
 * @param fallback - Optional content to render when not on a restaurant route
 */
export const RestaurantRouteWrapper = ({ 
  children, 
  fallback = null 
}: RestaurantRouteWrapperProps) => {
  const isRestaurantRoute = useRestaurantRoute()
  
  return isRestaurantRoute ? <>{children}</> : <>{fallback}</>
}