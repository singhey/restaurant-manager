import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Button } from "@workspace/ui/components/button"
import { User, Settings } from "lucide-react"

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
          <span className="sr-only">User menu</span>
        </Button>
      </div>
    </header>
  )
}