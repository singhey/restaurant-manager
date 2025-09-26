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
import { Toaster } from "@workspace/ui/components/sonner"
import { NotFound } from '../components/errors'

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
                  onSetActive={organization => organization && navigate({ to: `/restaurant/manage/${organization.slug}` as any })}
                />
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
          <Toaster richColors />
          {/* <div className="flex flex-1"> */}
          <Outlet />
          {/* </div> */}
        </SidebarInset>
      </SidebarProvider>
    </DataProvider>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound
})