import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { OrderCard } from './order-card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Card, CardContent } from '@workspace/ui/components/card'
import type {Order} from '@workspace/db'

interface OrdersListProps {
  orders: Order[]
  selectedOrderId?: string
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  onOrderClick: (order: Order) => void
  onLoadMore: () => void
}

function OrderCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function OrdersList({ 
  orders, 
  selectedOrderId,
  isLoading, 
  isFetchingNextPage, 
  hasNextPage, 
  onOrderClick, 
  onLoadMore 
}: OrdersListProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore()
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore])

  return (
    <div className="w-1/4 border-r bg-background overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="text-sm text-muted-foreground">{orders.length} orders</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))
          ) : (
            <>
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrderId === order.id}
                  onClick={onOrderClick}
                />
              ))}
              
              {/* Infinite scroll trigger */}
              {hasNextPage && (
                <div ref={ref} className="py-4">
                  {isFetchingNextPage && (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <OrderCardSkeleton key={i} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}