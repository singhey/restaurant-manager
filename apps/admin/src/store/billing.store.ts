import type { MenuItem } from '@workspace/db/generated/prisma/client'
import {create} from 'zustand'


interface CartItem {
  menuItem: MenuItem,
  quantity: number,
  id: string,
}

interface BillingState {
  dishSearch: string,
  inCart: CartItem[],
  addToCart: (menuItem: MenuItem, quantity: number, id: string) => void,
  removeFromCart: (id: string) => void,
  emptyCart: () => void
  setDishSearch: (search: string) => void 
  updateQuantity: (id: string, quantity: number) => void
}


export const useBilling = create<BillingState>((set) => ({
  dishSearch: '',
  inCart: [],
  addToCart(menuItem, quantity, id) {
    set((state) => ({
      ...state,
      inCart: [...state.inCart, {menuItem, quantity, id}]
    }))
  },
  removeFromCart(id) {
    set((state) => ({
      ...state,
      inCart: state.inCart.filter(item => item.id !== id)
    }))
  },
  emptyCart() {
    set((state) => ({
      ...state,
      inCart: []
    }))
  },
  setDishSearch(search) {
    set((state) => ({
      ...state,
      dishSearch: search
    }))
  },
  updateQuantity(id, quantity) {
    set((state) => ({
      ...state,
      inCart: state.inCart.map(cart => {
        if(cart.id === id) {
          return {...cart, quantity}
        }
        return cart
      })
    }))
  },
}))