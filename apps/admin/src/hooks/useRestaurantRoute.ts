import { useLocation } from '@tanstack/react-router'

/**
 * Custom hook to check if the current URL starts with '/restaurant'
 * @returns boolean indicating if the current route starts with '/restaurant'
 */
export const useRestaurantRoute = (): boolean => {
  const location = useLocation()
  return location.pathname.startsWith('/restaurant')
}