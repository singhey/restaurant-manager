import { useBilling } from '@/store/billing.store'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Separator } from '@workspace/ui/components/separator'
import { Badge } from '@workspace/ui/components/badge'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCreateOrder } from '@workspace/db/hooks/trpc'
import { toast } from 'sonner'

export const Route = createFileRoute(
  '/restaurant/manage/$restaurantId/menu/billing/checkout',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { inCart, updateQuantity, removeFromCart, emptyCart } = useBilling()
  const [customerName, setCustomerName] = useState('')
  const [customerNumber, setCustomerNumber] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [flatDiscount, setFlatDiscount] = useState(0)
  const {mutate: createOrder} = useCreateOrder()
  const navigate = useNavigate()
  const {restaurantId} = useParams({from: '/restaurant/manage/$restaurantId/menu/billing/checkout'})

  // Calculate totals
  const subtotal = inCart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
  const totalTax = inCart.reduce((sum, item) => {
    const itemTotal = item.menuItem.price * item.quantity
    const itemTax = (itemTotal * item.menuItem.tax) / 100
    return sum + itemTax
  }, 0)
  const subtotalWithTax = subtotal + totalTax
  const discountAmount = (subtotalWithTax * discountPercent) / 100
  const totalAfterDiscount = subtotalWithTax - discountAmount - flatDiscount
  const finalTotal = Math.max(0, totalAfterDiscount)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    // Implement checkout logic here
    createOrder({
      data: {
        orderType: 'DINE_IN',
        subtotal,
        tax: totalTax,
        discount: discountAmount,
        total: finalTotal,
        restaurantId: restaurantId,
        items: inCart.map(item => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          unitPrice: item.menuItem.price,
          totalPrice: item.menuItem.price * item.quantity,
          addons: [],
          id: ''
        })),
        orderSettlement: []
      }
    }, {
      onSettled: (_, error) => {
        if(error) {
          toast.error('Unable to generate bill. Try again : ' + error.message)
        }else {
          navigate({to: `/restaurant/manage/$restaurantId/menu`, params: {restaurantId}})
        }
      }
    })
    console.log("Create called")
    console.log('Checkout:', {
      items: inCart,
      customer: { name: customerName, number: customerNumber },
      subtotal,
      tax: totalTax,
      discountPercent,
      flatDiscount,
      discountAmount,
      total: finalTotal
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Cart Items Table and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Items</CardTitle>
                {inCart.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={emptyCart}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {inCart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">Your cart is empty</p>
                  <p className="text-sm">Add items from the menu to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">Total</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Table Rows */}
                  {inCart.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 py-3 border-b last:border-b-0 items-center">
                      <div className="col-span-5">
                        <div>
                          <h4 className="font-medium">{item.menuItem.name}</h4>
                          {item.menuItem.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.menuItem.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="col-span-2 text-right font-medium">
                        ₹{item.menuItem.price.toFixed(2)}
                      </div>

                      <div className="col-span-2 text-right font-medium">
                        ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discount and Customer Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discount Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-percent">Discount (%)</Label>
                  <Input
                    id="discount-percent"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flat-discount">Flat Discount (₹)</Label>
                  <Input
                    id="flat-discount"
                    type="number"
                    min="0"
                    value={flatDiscount}
                    onChange={(e) => setFlatDiscount(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-number">Phone Number</Label>
                  <Input
                    id="customer-number"
                    type="tel"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {totalTax > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>₹{totalTax.toFixed(2)}</span>
                </div>
              )}

              {discountPercent > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              {flatDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Flat Discount</span>
                  <span>-₹{flatDiscount.toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={inCart.length === 0}
                >
                  Complete Order
                </Button>

                {inCart.length > 0 && (
                  <div className="text-center">
                    <Badge variant="secondary">
                      {inCart.length} item{inCart.length !== 1 ? 's' : ''} in cart
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
