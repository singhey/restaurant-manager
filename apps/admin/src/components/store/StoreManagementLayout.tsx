import { Link, useLocation, useParams } from '@tanstack/react-router'
import { cn } from '@workspace/ui/lib/utils'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

interface StoreManagementLayoutProps {
  children: React.ReactNode
}

interface TabItem {
  key: string
  label: string
  href: string
  shortLabel?: string
}

export function StoreManagementLayout({ children }: StoreManagementLayoutProps) {
  const location = useLocation()
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/store/' })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs: TabItem[] = [
    {
      key: 'details',
      label: 'Store Details',
      shortLabel: 'Details',
      href: `/restaurant/manage/${restaurantId}/store/details`
    },
    {
      key: 'seo',
      label: 'SEO Configuration',
      shortLabel: 'SEO',
      href: `/restaurant/manage/${restaurantId}/store/seo`
    },
    {
      key: 'delivery',
      label: 'Delivery Settings',
      shortLabel: 'Delivery',
      href: `/restaurant/manage/${restaurantId}/store/delivery`
    },
    {
      key: 'location',
      label: 'Location Management',
      shortLabel: 'Location',
      href: `/restaurant/manage/${restaurantId}/store/location`
    }
  ]

  const isActiveTab = (href: string) => {
    return location.pathname === href
  }

  const currentTab = tabs.find(tab => isActiveTab(tab.href))

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // Navigation will be handled by the Link component
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Header */}
      <div className="md:hidden border-b border-border bg-background">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold">
            {currentTab?.label || 'Store Management'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="h-8 w-8 p-0"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-navigation"
            className="border-t border-border bg-background"
            role="navigation"
            aria-label="Store management navigation"
          >
            <div className="px-4 py-2 space-y-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  to={tab.href}
                  className={cn(
                    'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    isActiveTab(tab.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                  onKeyDown={handleKeyDown}
                  tabIndex={0}
                  role="tab"
                  aria-selected={isActiveTab(tab.href)}
                  aria-controls={`tabpanel-${tab.key}`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block border-b border-border">
        <div className="flex h-12 items-center">
          <nav 
            className="flex space-x-1 px-6 overflow-x-auto" 
            aria-label="Store management tabs"
            role="tablist"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                to={tab.href}
                className={cn(
                  'relative flex h-12 items-center px-4 text-sm font-medium transition-colors whitespace-nowrap',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
                  'hover:text-foreground',
                  isActiveTab(tab.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="tab"
                aria-selected={isActiveTab(tab.href)}
                aria-controls={`tabpanel-${tab.key}`}
              >
                <span className="hidden lg:inline">{tab.label}</span>
                <span className="lg:hidden">{tab.shortLabel || tab.label}</span>
                {isActiveTab(tab.href) && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div 
        className="flex-1 overflow-auto"
        role="tabpanel"
        id={`tabpanel-${currentTab?.key || 'content'}`}
        aria-labelledby={`tab-${currentTab?.key || 'content'}`}
      >
        {children}
      </div>
    </div>
  )
}