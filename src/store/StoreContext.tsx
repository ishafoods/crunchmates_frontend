import { useEffect, useMemo, useReducer } from 'react'
import { defaultContent, defaultProducts } from '../data/catalog'
import { api, clearToken, getToken, setToken } from '../api'
import type {
  AdminProfile,
  CartItem,
  CheckoutForm,
  Order,
  Product,
  ProductFormValues,
  SiteContent,
  UserProfile,
} from '../types'
import { StoreContext } from './StoreContextDefinition'
import { openRazorpayCheckout, type RazorpaySuccess } from '../razorpay'

const STORAGE_KEY = 'crunchmates-store-v1'

type StoreState = {
  products: Product[]
  content: SiteContent
  cart: CartItem[]
  orders: Order[]
  user: UserProfile | null
  admin: AdminProfile | null
}

export type StoreApi = StoreState & {
  cartCount: number
  cartTotal: number
  featuredProducts: Product[]
  productsBySlug: Record<string, Product>
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  loginUser: (profile: UserProfile) => Promise<void>
  logoutUser: () => void
  loginAdmin: (email: string, password: string) => Promise<boolean>
  logoutAdmin: () => void
  addProduct: (values: ProductFormValues, image?: string) => Promise<void>
  updateProduct: (productId: string, values: Partial<Product>) => Promise<void>
  deleteProduct: (productId: string) => Promise<void>
  updateContent: (content: Partial<SiteContent>) => Promise<void>
  placeOrder: (form: CheckoutForm) => Promise<Order | null>
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>
}

type Action =
  | { type: 'hydrate'; products: Product[]; content: SiteContent; cart: CartItem[]; orders: Order[]; user: UserProfile | null; admin: AdminProfile | null }
  | { type: 'cart/add'; productId: string; quantity: number }
  | { type: 'cart/update'; productId: string; quantity: number }
  | { type: 'cart/remove'; productId: string }
  | { type: 'cart/clear' }
  | { type: 'auth/userLogin'; profile: UserProfile }
  | { type: 'auth/userLogout' }
  | { type: 'auth/adminLogin'; admin: AdminProfile }
  | { type: 'auth/adminLogout' }
  | { type: 'product/add'; product: Product }
  | { type: 'product/update'; productId: string; values: Partial<Product> }
  | { type: 'product/delete'; productId: string }
  | { type: 'content/update'; content: Partial<SiteContent> }
  | { type: 'orders/place'; order: Order }
  | { type: 'orders/updateStatus'; orderId: string; status: Order['status'] }

// Only the session identity is persisted; catalog, cart and orders are re-fetched from the API,
// and product images are large enough to blow the localStorage quota.
type PersistedState = Pick<StoreState, 'user' | 'admin'>

function createInitialState(): StoreState {
  const fallback: StoreState = {
    products: defaultProducts,
    content: defaultContent,
    cart: [],
    orders: [],
    user: null,
    admin: null,
  }

  if (typeof window === 'undefined') {
    return fallback
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return fallback
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      ...fallback,
      user: parsed.user ?? null,
      admin: parsed.admin ?? null,
    }
  } catch {
    return fallback
  }
}

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'hydrate':
      return { products: action.products, content: action.content, cart: action.cart, orders: action.orders, user: action.user, admin: action.admin }
    case 'cart/add': {
      const existing = state.cart.find((item) => item.productId === action.productId)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === action.productId
              ? { ...item, quantity: item.quantity + action.quantity }
              : item,
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { productId: action.productId, quantity: action.quantity }],
      }
    }

    case 'cart/update':
      return {
        ...state,
        cart:
          action.quantity <= 0
            ? state.cart.filter((item) => item.productId !== action.productId)
            : state.cart.map((item) =>
                item.productId === action.productId ? { ...item, quantity: action.quantity } : item,
              ),
      }

    case 'cart/remove':
      return {
        ...state,
        cart: state.cart.filter((item) => item.productId !== action.productId),
      }

    case 'cart/clear':
      return { ...state, cart: [] }

    case 'auth/userLogin':
      return { ...state, user: action.profile }

    case 'auth/userLogout':
      return { ...state, user: null }

    case 'auth/adminLogin':
      return { ...state, admin: action.admin }

    case 'auth/adminLogout':
      return { ...state, admin: null }

    case 'product/add':
      return { ...state, products: [action.product, ...state.products] }

    case 'product/update':
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.productId ? { ...product, ...action.values } : product,
        ),
      }

    case 'product/delete':
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.productId),
        cart: state.cart.filter((item) => item.productId !== action.productId),
      }

    case 'content/update':
      return {
        ...state,
        content: { ...state.content, ...action.content },
      }

    case 'orders/place':
      return {
        ...state,
        orders: [action.order, ...state.orders],
        cart: [],
      }

    case 'orders/updateStatus':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId ? { ...order, status: action.status } : order,
        ),
      }

    default:
      return state
  }
}

function buildProductMap(products: Product[]) {
  return products.reduce<Record<string, Product>>((map, product) => {
    map[product.slug] = product
    map[product.id] = product
    return map
  }, {})
}

function calculateCartTotal(cart: CartItem[], products: Product[]) {
  return cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.productId)
    return product ? total + product.price * item.quantity : total
  }, 0)
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  useEffect(() => {
    let active = true
    async function hydrate() {
      try {
        const catalog = await api.catalog()
        const cart = await api.cart()
        const token = getToken()
        let user: UserProfile | null = null
        let admin: AdminProfile | null = null
        let orders: Order[] = []
        if (token) {
          try {
            const profile = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
            if (profile.ok) {
              const account = await profile.json() as UserProfile & { role: 'customer' | 'admin' }
              if (account.role === 'admin') {
                admin = { email: account.email }
                orders = await api.adminOrders()
              } else {
                user = { name: account.name, email: account.email }
                orders = await api.orders()
              }
            }
          } catch {
            clearToken()
          }
        }
        if (active) dispatch({ type: 'hydrate', products: catalog.products, content: { ...defaultContent, ...catalog.content }, cart: cart.items, orders, user, admin })
      } catch (error) {
        console.error('Unable to load store data from API', error)
      }
    }
    void hydrate()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const persisted: PersistedState = { user: state.user, admin: state.admin }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
    } catch (error) {
      console.warn('Unable to persist session state', error)
    }
  }, [state.user, state.admin])

  const value = useMemo<StoreApi>(() => {
    const productsBySlug = buildProductMap(state.products)
    const cartTotal = calculateCartTotal(state.cart, state.products)
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)
    const featuredProducts = state.products.filter((product) => product.featured)

    return {
      ...state,
      cartCount,
      cartTotal,
      featuredProducts,
      productsBySlug,
      addToCart: async (productId: string, quantity = 1) => {
        const cart = await api.addCartItem(productId, quantity)
        dispatch({ type: 'hydrate', products: state.products, content: state.content, cart: cart.items, orders: state.orders, user: state.user, admin: state.admin })
      },
      updateCartQuantity: async (productId: string, quantity: number) => {
        const cart = await api.updateCartItem(productId, quantity)
        dispatch({ type: 'hydrate', products: state.products, content: state.content, cart: cart.items, orders: state.orders, user: state.user, admin: state.admin })
      },
      removeFromCart: async (productId: string) => {
        const cart = await api.removeCartItem(productId)
        dispatch({ type: 'hydrate', products: state.products, content: state.content, cart: cart.items, orders: state.orders, user: state.user, admin: state.admin })
      },
      clearCart: async () => {
        const cart = await api.clearCart()
        dispatch({ type: 'hydrate', products: state.products, content: state.content, cart: cart.items, orders: state.orders, user: state.user, admin: state.admin })
      },
      loginUser: async (profile: UserProfile) => {
        const result = await api.customerLogin(profile)
        setToken(result.token)
        dispatch({ type: 'auth/userLogin', profile: result.user })
        const orders = await api.orders()
        orders.forEach((order) => dispatch({ type: 'orders/place', order }))
      },
      logoutUser: () => { clearToken(); dispatch({ type: 'auth/userLogout' }) },
      loginAdmin: async (email: string, password: string) => {
        try {
          const result = await api.adminLogin(email, password)
          setToken(result.token)
          dispatch({ type: 'auth/adminLogin', admin: result.admin })
          const orders = await api.adminOrders()
          dispatch({ type: 'hydrate', products: state.products, content: state.content, cart: state.cart, orders, user: state.user, admin: result.admin })
          return true
        } catch {
          return false
        }
      },
      logoutAdmin: () => { clearToken(); dispatch({ type: 'auth/adminLogout' }) },
      addProduct: async (values: ProductFormValues, image?: string) => {
        const product = {
          name: values.name,
          flavor: values.flavor,
          tagline: values.tagline,
          description: values.description,
          price: Number(values.price),
          badge: values.badge,
          category: values.category,
          ingredients: values.ingredients
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          features: values.features
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          nutrition: values.nutrition
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          image,
          tone: {
            background: `linear-gradient(160deg, ${values.background} 0%, ${values.accent} 100%)`,
            accent: values.accent,
            highlight: values.highlight,
          },
          featured: true,
        }
        const saved = await api.addProduct(product)
        dispatch({ type: 'product/add', product: saved })
      },
      updateProduct: async (productId: string, values: Partial<Product>) => {
        const product = await api.updateProduct(productId, values)
        dispatch({ type: 'product/update', productId, values: product })
      },
      deleteProduct: async (productId: string) => { await api.deleteProduct(productId); dispatch({ type: 'product/delete', productId }) },
      updateContent: async (content: Partial<SiteContent>) => { const saved = await api.updateContent(content); dispatch({ type: 'content/update', content: saved }) },
      placeOrder: async (form: CheckoutForm) => {
        if (!state.cart.length) {
          return null
        }

        const { order, razorpay } = await api.placeOrder(form)

        if (!razorpay) {
          dispatch({ type: 'orders/place', order })
          return order
        }

        let payment: RazorpaySuccess | null
        try {
          payment = await openRazorpayCheckout({
            order: razorpay,
            name: 'Crunchmates',
            description: `Order ${order.id}`,
            prefill: { name: form.customerName, email: form.customerEmail, contact: form.customerPhone },
          })
        } catch (error) {
          await api.markPaymentFailed(order.id).catch(() => undefined)
          throw error
        }

        if (!payment) {
          await api.markPaymentFailed(order.id).catch(() => undefined)
          throw new Error('Payment was cancelled before it completed')
        }

        const paidOrder = await api.verifyPayment(order.id, {
          razorpayOrderId: payment.razorpay_order_id,
          razorpayPaymentId: payment.razorpay_payment_id,
          razorpaySignature: payment.razorpay_signature,
        })
        dispatch({ type: 'orders/place', order: paidOrder })
        return paidOrder
      },
      updateOrderStatus: async (orderId: string, status: Order['status']) => { const order = await api.updateOrderStatus(orderId, status); dispatch({ type: 'orders/updateStatus', orderId, status: order.status }) },
    }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

