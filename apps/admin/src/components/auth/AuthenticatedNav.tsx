import { Button } from "@workspace/ui/components/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { User } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { authClient } from "../../lib/auth"

export function AuthenticatedNav() {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Redirect to sign-in page after logout
          window.location.href = "/auth/sign-in"
        }
      }
    })
  }

  return (
    <div className="flex h-full">
      <div className="border-l border-border" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex h-full rounded-none w-16 items-center justify-center transition-colors cursor-pointer"
            variant="ghost"
          >
            <User className="h-4 w-4" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/auth/sign-in">
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}