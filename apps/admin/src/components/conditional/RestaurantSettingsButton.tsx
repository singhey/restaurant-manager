import { Settings } from "lucide-react"
import { useNavigate, useParams } from "@tanstack/react-router"
import { TopbarIconButton } from '@/components/layout/Topbar'
import { RenderWhenPathMatches } from "./RenderWhenPathMatches"

export function RestaurantSettingsButton() {
  
  return (
    <RenderWhenPathMatches paramName={'restaurantId'}>
      <RestaurantSettingsButtonComp />
    </RenderWhenPathMatches>
  )
}

function RestaurantSettingsButtonComp() {
  const {restaurantId} = useParams({from: '/restaurant/manage/$restaurantId'})
  const navigate = useNavigate()
  return <>
    <TopbarIconButton
        icon={Settings}
        label="Settings"
        onClick={() => navigate({ to: '/restaurant/manage/$restaurantId/store/details', params: { restaurantId } })}
      />
      <div className="border-l border-border" />
  </>
}