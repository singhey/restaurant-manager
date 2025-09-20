import { Button } from "@workspace/ui/components/button"
import { Link } from "@tanstack/react-router"

export function UnauthenticatedNav() {
  return (
    <div className="flex h-full">
      <Link to="/auth/sign-in" className="border-l">
        <Button
          className="flex h-full rounded-none px-6 items-center justify-center transition-colors cursor-pointer"
          variant="ghost"
        >
          login
        </Button>
      </Link>
      <Link to="/auth/sign-up" className="border-l">
        <Button
          className="flex h-full rounded-none px-6 items-center justify-center transition-colors cursor-pointer"
          variant="ghost"
        >
          register
        </Button>
      </Link>
    </div>
  )
}