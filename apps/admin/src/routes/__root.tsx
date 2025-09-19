import { createRootRoute, Outlet } from '@tanstack/react-router'
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

const RootLayout = () => {
  
  return (
    <DataProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-sm font-bold">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Admin</span>
                <span className="text-xs text-sidebar-foreground/70">Dashboard</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <NavigationMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DataProvider>
  )
}

export const Route = createRootRoute({ component: RootLayout })