import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import { useInfiniteFindManyOrder } from '@workspace/db/hooks/trpc'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { Badge } from '@workspace/ui/components/badge'
import { OrdersList } from '@/components/orders/orders-list'
import { OrderDetails } from '@/components/orders/order-details'
import { EmptyState } from '@/components/orders/empty-state'
import type { models } from '@workspace/db'

export const Route = createFileRoute('/restaurant/manage/$restaurantId/orders/')(
  {
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>) => {
      return {
        orderId: (search.orderId as string) || undefined,
      }
    },
  },
)

const ORDERS_PER_PAGE = 20

function RouteComponent() {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/orders/' })
  const navigate = useNavigate({ from: '/restaurant/manage/$restaurantId/orders' })
  const { orderId } = Route.useSearch()
  const [selectedOrder, setSelectedOrder] = useState<models.Order | null>(null)

  const { data: orders, isLoading, isFetching, fetchNextPage, hasNextPage } = useInfiniteFindManyOrder({
    where: {
      restaurantId
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: ORDERS_PER_PAGE,
  })

  const orderCards: models.Order[] = useMemo(() => {
    if (!orders) return []

    return orders.pages.flatMap(page => page)
  }, [orders])

  // Set selected order from search params or select first order if none specified
  useEffect(() => {
    if (orderCards.length > 0) {
      if (orderId) {
        const order = orderCards.find(o => o.id === orderId)
        if (order) {
          setSelectedOrder(order)
        }
      } else {
        // No orderId in search params, select the first order
        const firstOrder = orderCards[0]
        setSelectedOrder(firstOrder)
        
        // Update URL to include the first order's ID
        navigate({
          search: (prev) => ({
            ...prev,
            orderId: firstOrder.id,
          }),
          replace: true, // Use replace to avoid adding to browser history
        })
      }
    }
  }, [orderId, orderCards, navigate])

  const handleOrderClick = useCallback((orderCard: models.Order) => {
    const fullOrder = orderCards?.find(o => o.id === orderCard.id)
    setSelectedOrder(fullOrder || null)
    
    // Update search params with selected order ID
    navigate({
      search: (prev) => ({
        ...prev,
        orderId: orderCard.id,
      }),
    })
  }, [orderCards, navigate])

  const statusVariants: Record<models.OrderStatus, string> = {
    PENDING: 'default',
    CONFIRMED: 'secondary',
    PREPARING: 'outline',
    READY: 'default',
    COMPLETED: 'secondary',
    CANCELLED: 'destructive'
  }

  return (
    <div className="flex h-screen bg-background">
      <OrdersList
        orders={orderCards}
        selectedOrderId={selectedOrder?.id}
        isLoading={isLoading}
        isFetchingNextPage={isFetching}
        hasNextPage={hasNextPage}
        onOrderClick={handleOrderClick}
        onLoadMore={fetchNextPage}
      />

      {/* Right Panel - Order Details or Empty State */}
      <div className="flex-1 flex flex-col">
        {selectedOrder ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                  Order #{selectedOrder.id.slice(-6).toUpperCase()}
                </h1>
                <Badge variant={statusVariants[selectedOrder.status] as any}>
                  {selectedOrder.status}
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <OrderDetails order={selectedOrder} />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
