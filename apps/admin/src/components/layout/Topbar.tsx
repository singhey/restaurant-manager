import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { ArrowLeft, Search, type LucideIcon } from "lucide-react"
import { useLocation, Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { useState } from "react"
import { SignedIn, SignedOut } from '@daveyplate/better-auth-ui'
import { AuthenticatedNav } from "../auth/AuthenticatedNav"
import { UnauthenticatedNav } from "../auth/UnauthenticatedNav"
import { RenderWhenPathMatches } from "../conditional/RenderWhenPathMatches"

// Navigation item interface
interface NavigationItem {
  key: string
  label: string
  href: string
}

// Reusable topbar icon button component
interface TopbarIconButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
}

export const TopbarIconButton = ({ icon: Icon, label, onClick }: TopbarIconButtonProps) => (
  <Button
    className="flex h-full rounded-none w-16 items-center justify-center transition-colors cursor-pointer border-l"
    onClick={onClick}
    variant={"ghost"}
  >
    <Icon className="h-4 w-4" />
    <span className="sr-only">{label}</span>
  </Button>
)

// Search bar component for billing page
const TopbarSearchBar = () => {
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search menu items..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10 h-9 w-full bg-background border-border focus:border-ring"
      />
    </div>
  )
}

// Reusable topbar text button component
interface TopbarTextButtonProps {
  label: string
  href: string
  isActive: boolean
  onClick?: () => void
}

export const TopbarTextButton = ({ label, href, isActive, onClick }: TopbarTextButtonProps) => (
  <Link
    to={href}
    className={`relative flex h-full items-center justify-center px-6 text-sm font-medium hover:bg-accent transition-all duration-600 ease-in-out cursor-pointer ${isActive
      ? 'text-foreground'
      : 'text-muted-foreground hover:text-foreground'
      }`}
    onClick={onClick}
  >
    <span className="relative z-10">{label}</span>
    <div
      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-foreground transition-all duration-600 ease-in-out origin-left ${isActive
        ? 'scale-x-100 opacity-100'
        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
        }`}
    />
  </Link>
)

// Reusable topbar navigation component
interface TopbarNavigationProps {
  items: NavigationItem[]
  currentPath: string
  currentSearch: string
}

const TopbarNavigation = ({ items, currentPath, currentSearch }: TopbarNavigationProps) => {
  const getIsActive = (item: NavigationItem, index: number) => {
    const fullCurrentUrl = currentPath + currentSearch

    // If the item href matches exactly
    if (fullCurrentUrl === item.href) {
      return true
    }

    console.log(currentSearch)
    // If no search params and this is the first item, make it active by default
    if ((!currentSearch || currentSearch === "") && index === 0) {
      return true
    }

    return false
  }

  return (
    <div className="flex h-full">
      {items.map((item, index) => (
        <div key={item.key} className="flex h-full group">
          {index > 0 && <div className="border-l border-border" />}
          <TopbarTextButton
            label={item.label}
            href={item.href}
            isActive={getIsActive(item, index)}
            onClick={() => console.log(`${item.label} clicked`)}
          />
        </div>
      ))}
    </div>
  )
}

// Route-specific navigation data
const getNavigationItems = (pathname: string): NavigationItem[] => {
  if (pathname === '/') {
    return [
      { key: 'today', label: 'today', href: '/?period=today' },
      { key: 'daily', label: 'daily', href: '/?period=daily' },
      { key: 'monthly', label: 'monthly', href: '/?period=monthly' },
      { key: 'yearly', label: 'yearly', href: '/?period=yearly' }
    ]
  }

  if (pathname === '/menu/billing') {
    return [
      { key: 'menu', label: 'menu', href: '/menu/billing?view=menu' },
      { key: 'checkout', label: 'checkout', href: '/menu/billing?view=checkout' },
      { key: 'table', label: 'table', href: '/menu/billing?view=table' }
    ]
  }

  if (pathname === '/orders/live') {
    return [
      { key: 'active', label: 'active', href: '/orders/live' },
      { key: 'pending', label: 'pending', href: '/orders/pending' },
      { key: 'completed', label: 'completed', href: '/orders/completed' }
    ]
  }

  if (pathname === '/orders/kitchen') {
    return [
      { key: 'queue', label: 'queue', href: '/orders/kitchen' },
      { key: 'preparing', label: 'preparing', href: '/orders/preparing' },
      { key: 'ready', label: 'ready', href: '/orders/ready' }
    ]
  }

  if (pathname.includes('/orders/') && pathname.includes('history')) {
    return [
      { key: 'today', label: 'today', href: pathname + '?filter=today' },
      { key: 'week', label: 'this week', href: pathname + '?filter=week' },
      { key: 'month', label: 'this month', href: pathname + '?filter=month' }
    ]
  }

  if (pathname === '/customers') {
    return [
      { key: 'all', label: 'all', href: '/customers' },
      { key: 'regular', label: 'regular', href: '/customers/regular' },
      { key: 'vip', label: 'vip', href: '/customers/vip' }
    ]
  }

  if (pathname.includes('/management') || pathname.includes('/menu/edit') || pathname.includes('/menu/addons') || pathname.includes('/menu/vouchers') || pathname.includes('/menu/offers')) {
    return [
      { key: 'menu', label: 'menu', href: '/menu/edit' },
      { key: 'addons', label: 'add-ons', href: '/menu/addons' },
      { key: 'vouchers', label: 'vouchers', href: '/menu/vouchers' },
      { key: 'offers', label: 'offers', href: '/menu/offers' }
    ]
  }

  if (pathname.includes('/store') || pathname.includes('/stores')) {
    // Extract restaurantId from pathname for store management routes
    const restaurantIdMatch = pathname.match(/\/restaurant\/manage\/([^\/]+)\/store/)
    if (restaurantIdMatch) {
      const restaurantId = restaurantIdMatch[1]
      return [
        { key: 'details', label: 'details', href: `/restaurant/manage/${restaurantId}/store/details` },
        { key: 'seo', label: 'seo', href: `/restaurant/manage/${restaurantId}/store/seo` },
        { key: 'delivery', label: 'delivery', href: `/restaurant/manage/${restaurantId}/store/delivery` },
        { key: 'location', label: 'location', href: `/restaurant/manage/${restaurantId}/store/location` }
      ]
    }
    
    return [
      { key: 'details', label: 'details', href: '/store/details' },
      { key: 'settings', label: 'settings', href: '/store/settings' },
      { key: 'all-stores', label: 'all stores', href: '/stores' }
    ]
  }

  if (pathname === '/account') {
    return [
      { key: 'profile', label: 'profile', href: '/account' },
      { key: 'security', label: 'security', href: '/account/security' },
      { key: 'preferences', label: 'preferences', href: '/account/preferences' }
    ]
  }

  return []
}

export function Topbar() {
  const location = useLocation()

  const renderCenterContent = (): NavigationItem[] => {
    return getNavigationItems(location.pathname)
  }

  const showSearchBar = location.pathname === '/menu/billing'

  return (
    <header className="flex h-16 shrink-0 items-center border-b">
      <RenderWhenPathMatches paramName="restaurantId">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </RenderWhenPathMatches>
      <RenderWhenPathMatches pathname={['/restaurant/account/settings']}>
        <Button asChild variant={"ghost"} className="pl-4">
          <Link to={`/restaurant/selector`}>
            <ArrowLeft />
            Manage Restaurants
          </Link>
        </Button>
      </RenderWhenPathMatches>

      {showSearchBar && (
        <div className="flex flex-1 items-center px-4">
          <TopbarSearchBar />
        </div>
      )}

      <div className={`flex ${showSearchBar ? '' : 'flex-1'} justify-end items-center h-full`}>
        <TopbarNavigation
          items={renderCenterContent()}
          currentPath={location.pathname}
          currentSearch={location.searchStr}
        />
      </div>
      <div className="flex h-full">
        <SignedOut>
          <UnauthenticatedNav />
        </SignedOut>
        <SignedIn>
          <AuthenticatedNav />
        </SignedIn>
      </div>
    </header>
  )
}