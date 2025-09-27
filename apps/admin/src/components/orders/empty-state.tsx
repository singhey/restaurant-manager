import { Package } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium mb-2">Select an order</h3>
        <p className="text-sm">Choose an order from the list to view details</p>
      </div>
    </div>
  )
}