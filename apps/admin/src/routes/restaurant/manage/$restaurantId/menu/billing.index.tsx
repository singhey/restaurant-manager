import { MenuEditorErrorBoundary } from '@/components/menu-editor'
import { createFileRoute, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import type { Category, MenuItem } from '@workspace/db/generated/prisma/client'
import { useFindManyCategory, useFindManyMenuItem } from '@workspace/db/hooks/trpc'
import { ChevronDown, Plus, Minus, UtensilsCrossed } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { useBilling } from '@/store/billing.store'

export const Route = createFileRoute(
  '/restaurant/manage/$restaurantId/menu/billing/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/menu/billing/' })
  const { data: categories, isFetching } = useFindManyCategory({
    where: {
      restaurantId,
      parentId: null
    },
    include: {
      children: true
    }
  })
  const {categoryId} = useSearch({strict: false}) as any
  const navigate = useNavigate()

  if (isFetching) {

  }

  if (!categories) {
    return <div>Unable to fetch categories</div>
  }

  if(!categoryId) {
    navigate({
      search: {categoryId: categories[0].children[0].id} as any
    })
  }

  return <MenuEditorErrorBoundary>
    <div className="flex w-full h-full min-h-[600px]">
      {/* Left Panel - Menu Structure */}
      <div className="w-1/4 flex border-r flex-col">
        {
          categories.map(category => <CategoryBillRow key={category.id} category={category} />)
        }
      </div>

      {/* Right Panel - Menu Dishes */}
      <div className="w-3/4 overflow-y-auto">
        <MenuDishes />
      </div>
    </div>
  </MenuEditorErrorBoundary>
}


const CategoryBillRow = ({ category }: { category: Category & { children: Category[] } }) => {
  const [opened, setOpened] = useState(true)
  const navigate = useNavigate()
  const { categoryId } = useSearch({ strict: false }) as any
  const setDishSearch = useBilling(state => state.setDishSearch)

  return <div className='w-full flex flex-col'>
    <div onClick={() => setOpened(!opened)} className='flex w-full border-b relative p-3 hover:bg-accent px-4 text-sm cursor-pointer'>
      {category.name}
      {category.children.length > 0 && <ChevronDown className={`w-4 absolute right-4 ${opened ? `rotate-0`: `rotate-[-90deg]`}`} />}
    </div>
    {
      opened && <div>
        {
          category.children.map(subCategory => <div key={subCategory.id}
            className={`flex pl-8 w-full p-2 hover:bg-accent px-4 text-sm cursor-pointer ${categoryId === subCategory.id && `bg-accent border-r-red-500 border-r-2`}`}
            onClick={() => {navigate({
              search: { categoryId: subCategory.id } as any
            }); setDishSearch('')}}>
            {subCategory.name}
          </div>)
        }
      </div>
    }
  </div>
}


const MenuDishes = () => {
  const { restaurantId } = useParams({ from: '/restaurant/manage/$restaurantId/menu/billing/' })
  const { categoryId } = useSearch({ strict: false }) as any
  const dishSearch = useBilling(state => state.dishSearch)
  const { data: dishes, isFetching } = useFindManyMenuItem({
    where: {
      restaurantId,
      isAvailable: true
    }
  })

  if (isFetching) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Loading dishes...</div>
    </div>
  }

  if (!dishes || dishes.length === 0) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">No dishes found in this category</div>
    </div>
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.filter(dish => {
          if(dishSearch) {
            return dish.name.toLowerCase().indexOf(dishSearch) !== -1
          }
          return dish.categoryId === categoryId
        }).map(dish => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  )
}

const DishCard = ({ dish }: { dish: MenuItem }) => {
  const inCart = useBilling(state => state.inCart)
  const quantity = inCart.filter(cart => cart.menuItem.id === dish.id).reduce((acc, cart) => acc + cart.quantity, 0)
  const addToCart = useBilling(state => state.addToCart)
  const removeFromCart = useBilling(state => state.removeFromCart)
  const updateQuantity = useBilling(state => state.updateQuantity)

  const handleIncrease = () => {
    if(quantity === 0) {
      addToCart(dish, 1, dish.id)
    }else {
      updateQuantity(dish.id, quantity + 1)
    }
  }

  const handleDecrease = () => {
    if(quantity === 1) {
      removeFromCart(dish.id)
    }else {
      updateQuantity(dish.id, quantity - 1)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow relative">
      <div className="flex items-start gap-3 mb-8">
        {/* Icon on the left */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Dish Title */}
          <h3 className="font-medium text-sm text-foreground truncate mb-1">
            {dish.name}
          </h3>

          {/* Description (if available) */}
          {dish.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {dish.description}
            </p>
          )}

          {/* Price */}
          <span className="font-semibold text-foreground">
            {formatPrice(dish.price)}
          </span>
        </div>
      </div>

      {/* Quantity Controls - Bottom Right */}
      <div className="absolute bottom-4 right-4">
        {quantity === 0 ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleIncrease}
            className="h-8 w-24 text-xs"
          >
            Add
          </Button>
        ) : (
          <div className="flex items-center border rounded-md w-24">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDecrease}
              className="h-8 w-8 p-0 hover:bg-muted rounded-none"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex-1 py-1 text-xs font-medium text-center">
              {quantity}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleIncrease}
              className="h-8 w-8 p-0 hover:bg-muted rounded-none"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}