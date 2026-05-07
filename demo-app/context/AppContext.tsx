"use client"

import { createContext, useContext, useReducer, ReactNode } from "react"
import { User, CartItem, Order, Product, AppView, OrderStatus, VisitStatus } from "@/lib/types"
import { tenants, getDiscountedPrice, generateOrderId, mockOrders } from "@/lib/mock-data"

type AppState = {
  currentUser: User | null
  cart: CartItem[]
  orders: Order[]
  currentView: AppView
  selectedProduct: Product | null
  pendingFulfillment: string
}

type AppAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_FULFILLMENT"; payload: string }
  | { type: "CREATE_ORDER"; payload: {
      userId: number
      userName: string
      tenantId: string
      tenantName: string
      items: CartItem[]
      paymentMethod: string
      fulfillmentOption: string
    }}
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: OrderStatus } }
  | { type: "COMPLETE_VISIT1"; payload: { orderId: string } }
  | { type: "SET_VIEW"; payload: AppView }
  | { type: "SELECT_PRODUCT"; payload: Product | null }

const initialState: AppState = {
  currentUser: null,
  cart: [],
  orders: mockOrders,
  currentView: "catalog",
  selectedProduct: null,
  pendingFulfillment: "pickup",
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload, currentView: "catalog" }

    case "LOGOUT":
      return { ...initialState }

    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.product.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.product.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { ...state, cart: [...state.cart, { product: action.payload, quantity: 1 }] }
    }

    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((i) => i.product.id !== action.payload) }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((i) =>
            i.product.id === action.payload.productId
              ? { ...i, quantity: action.payload.quantity }
              : i
          )
          .filter((i) => i.quantity > 0),
      }

    case "CLEAR_CART":
      return { ...state, cart: [] }

    case "SET_FULFILLMENT":
      return { ...state, pendingFulfillment: action.payload }

    case "CREATE_ORDER": {
      const { userId, userName, tenantId, tenantName, items, paymentMethod, fulfillmentOption } = action.payload
      const tenant = tenants.find((t) => t.id === tenantId)
      const discount = tenant?.discount ?? 0

      const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
      const total = items.reduce(
        (sum, i) => sum + getDiscountedPrice(i.product.price, discount) * i.quantity,
        0
      )

      const order: Order = {
        id: generateOrderId(),
        userId,
        userName,
        tenantId,
        tenantName,
        items: [...items],
        subtotal,
        discount,
        total,
        status: "pendiente",
        paymentMethod,
        fulfillmentOption,
        createdAt: new Date().toISOString(),
      }

      return { ...state, orders: [...state.orders, order] }
    }

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
        ),
      }

    case "COMPLETE_VISIT1":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.orderId
            ? { ...o, visitStatus: "v1-done" as VisitStatus }
            : o
        ),
      }

    case "SET_VIEW":
      return { ...state, currentView: action.payload }

    case "SELECT_PRODUCT":
      return { ...state, selectedProduct: action.payload }

    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
