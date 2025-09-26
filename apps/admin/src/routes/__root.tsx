import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import {
  SidebarProvider,
  SidebarInset,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent
} from '@workspace/ui/components/sidebar'
import DataProvider from '../lib/DataProvider'
import { Topbar } from '../components/layout/Topbar'
import { NavigationMenu } from '../components/layout/NavigationMenu'
import { OrganizationSwitcher } from '@daveyplate/better-auth-ui'
import { RenderWhenPathMatches } from '@/components/conditional/RenderWhenPathMatches'
import { Confirm } from '@/components/generic/Confirm'
import { Modal } from '@/components/generic/Modal'

const RootLayout = () => {

  const navigate = useNavigate()

  return (
    <DataProvider>
      <SidebarProvider>
        <RenderWhenPathMatches paramName='restaurantId'>
          <Sidebar>
            <div className='bg-background h-full'>
            <SidebarHeader className='border-b h-16 justify-center'>
              <OrganizationSwitcher hidePersonal={true}
                className='bg-primary-foreground hover:bg-primary-foreground text-secondary-foreground' 
                onSetActive={organization => organization && navigate({to: `/restaurant/manage/${organization.slug}` as any})}
                />
              {/* <div className="flex items-center gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-sm font-bold">A</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Admin</span>
                  <span className="text-xs text-sidebar-foreground/70">Dashboard</span>
                </div>
              </div> */}
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <NavigationMenu />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            </div>
          </Sidebar>
        </RenderWhenPathMatches>
        <SidebarInset>
          <Topbar />
          <Confirm.Root />
          <Modal.Root />
          {/* <div className="flex flex-1"> */}
            <Outlet />
          {/* </div> */}
        </SidebarInset>
      </SidebarProvider>
    </DataProvider>
  )
}

export const Route = createRootRoute({ component: RootLayout })