import { Link, useLocation, useParams } from '@tanstack/react-router'
import { cn } from '@workspace/ui/lib/utils'

interface StoreManagementLayoutProps {
  children: React.ReactNode
}

interface TabItem {
  key: string
  label: string
  href: string
}

export function StoreManagementLayout({ children }: StoreManagementLayoutProps) {
  const location = useLocation()
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/store' })

  const tabs: TabItem[] = [
    {
      key: 'details',
      label: 'Store Details',
      href: `/restaurant/manage/${restaurantId}/store/details`
    },
    {
      key: 'seo',
      label: 'SEO Configuration',
      href: `/restaurant/manage/${restaurantId}/store/seo`
    },
    {
      key: 'delivery',
      label: 'Delivery Settings',
      href: `/restaurant/manage/${restaurantId}/store/delivery`
    },
    {
      key: 'location',
      label: 'Location Management',
      href: `/restaurant/manage/${restaurantId}/store/location`
    }
  ]

  const isActiveTab = (href: string) => {
    return location.pathname === href
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex h-12 items-center">
          <nav className="flex space-x-8 px-6" aria-label="Store management tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                to={tab.href}
                className={cn(
                  'relative flex h-12 items-center px-1 text-sm font-medium transition-colors hover:text-foreground',
                  isActiveTab(tab.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {tab.label}
                {isActiveTab(tab.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}