import { Card, CardContent } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Clock, User } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import {models} from '@workspace/db'
import { paymentStatusVariants } from './order-details'


interface OrderCardProps {
  order: models.Order
  onClick: (order: models.Order) => void
  isSelected?: boolean
  className?: string
}

const statusVariants: Record<models.OrderStatus, string> = {
  PENDING: 'default',
  CONFIRMED: 'secondary', 
  PREPARING: 'outline',
  READY: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive'
}


export function OrderCard({ order, onClick, isSelected = false, className }: OrderCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: Date) => {
    return dateString.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4",
        isSelected ? "border-l-green-500" : "border-l-primary",
        className
      )}
      onClick={() => onClick(order)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-sm">
            #{order.id.slice(-6).toUpperCase()}
          </span>
          <Badge variant={statusVariants[order.status] as any}>
            {order.status}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(order.createdAt)}
          </div>
          
          {order.customer?.name && (
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="w-3 h-3 mr-1" />
              {order.customer.name}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-semibold">
              {formatCurrency(order.total)}
            </span>
            <Badge variant={paymentStatusVariants[order.paymentStatus] as any}>
              {order.paymentStatus}
            </Badge>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}