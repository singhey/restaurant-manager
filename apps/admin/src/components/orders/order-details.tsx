import { Badge } from '@workspace/ui/components/badge'
import { Separator } from '@workspace/ui/components/separator'
import { User, Phone, ChefHat, CreditCard } from 'lucide-react'
import type {Order, PaymentStatus} from '@workspace/db'


export const paymentStatusVariants: Record<PaymentStatus, string> = {
  PAID: 'default',
  PENDING: 'secondary',
  FAILED: 'destructive', 
  REFUNDED: 'outline'
}

export function OrderDetails({ order }: {order: Order}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  console.log(order)

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Order Type</label>
          <p className="text-sm font-medium">{order.orderType}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Created</label>
          <p className="text-sm font-medium">{order.createdAt.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
        </div>
      </div>

      {/* Customer Info */}
      {order.customer && (
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Customer Information
          </h4>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            {order.customer.name && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{order.customer.name}</span>
              </div>
            )}
            {order.customer.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{order.customer.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div>
        <h4 className="font-medium mb-3 flex items-center">
          <ChefHat className="w-4 h-4 mr-2" />
          Order Items
        </h4>
        <div className="space-y-3">
          {order.items?.length > 0 ? order.items.map((item: any, index: number) => (
            <div key={index} className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{item.name}</h5>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{formatCurrency(item.totalPrice)}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(item.unitPrice)} each</p>
                </div>
              </div>
              
              {item.addons && item.addons.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Add-ons:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.addons.map((addon: any, addonIndex: any) => (
                      <Badge key={addonIndex} variant="outline" className="text-xs">
                        {addon}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {item.notes && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                  <p className="text-xs bg-yellow-50 p-2 rounded border-l-2 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                    {item.notes}
                  </p>
                </div>
              )}
            </div>
          )) : (
            <div className="bg-muted/50 p-4 rounded-lg text-center text-muted-foreground">
              <p className="text-sm">No items available for this order</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div>
          <h4 className="font-medium mb-2">Order Notes</h4>
          <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
            <p className="text-sm">{order.notes}</p>
          </div>
        </div>
      )}

      <Separator />

      {/* Payment Summary */}
      <div>
        <h4 className="font-medium mb-3 flex items-center">
          <CreditCard className="w-4 h-4 mr-2" />
          Payment Summary
        </h4>
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Discount</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-muted-foreground">Payment Status</span>
            <Badge variant={paymentStatusVariants[order.paymentStatus] as any}>
              {order.paymentStatus}
            </Badge>
          </div>
          {order.paymentMethod && (
            <div className="flex justify-between text-sm">
              <span>Payment Method</span>
              <span>{order.paymentMethod}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}