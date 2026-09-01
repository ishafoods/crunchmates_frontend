import type { CheckoutForm, Order, Product, SiteContent, UserProfile } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
const TOKEN_KEY = 'crunchmates-token'
const SESSION_KEY = 'crunchmates-session-id'

type CartResponse = { items: Array<{ productId: string; quantity: number }>; cartCount: number; cartTotal: number }
type CatalogResponse = { products: Product[]; content: SiteContent }
export type RazorpayOrderInfo = { keyId: string; orderId: string; amount: number; currency: string }
export type PlaceOrderResponse = { order: Order; razorpay: RazorpayOrderInfo | null }
export type PaymentVerification = { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }

function sessionId() {
  let value = localStorage.getItem(SESSION_KEY)
  if (!value) {
    value = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, value)
  }
  return value
}

export function getToken() { return localStorage.getItem(TOKEN_KEY) }
export function setToken(token: string) { localStorage.setItem(TOKEN_KEY, token) }
export function clearToken() { localStorage.removeItem(TOKEN_KEY) }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  headers.set('x-session-id', sessionId())
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.message ?? `API request failed (${response.status})`)
  return body as T
}

export const api = {
  catalog: () => request<CatalogResponse>('/catalog'),
  cart: () => request<CartResponse>('/cart'),
  addCartItem: (productId: string, quantity: number) => request<CartResponse>('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (productId: string, quantity: number) => quantity <= 0 ? request<CartResponse>(`/cart/items/${productId}`, { method: 'DELETE' }) : request<CartResponse>(`/cart/items/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  removeCartItem: (productId: string) => request<CartResponse>(`/cart/items/${productId}`, { method: 'DELETE' }),
  clearCart: () => request<CartResponse>('/cart', { method: 'DELETE' }),
  customerLogin: (profile: UserProfile) => request<{ token: string; user: UserProfile }>('/auth/customer', { method: 'POST', body: JSON.stringify(profile) }),
  adminLogin: (email: string, password: string) => request<{ token: string; admin: { email: string } }>('/auth/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  orders: () => request<Order[]>('/orders/me'),
  adminOrders: () => request<Order[]>('/admin/orders'),
  placeOrder: (form: CheckoutForm) => request<PlaceOrderResponse>('/orders', { method: 'POST', body: JSON.stringify(form) }),
  verifyPayment: (orderId: string, payload: PaymentVerification) => request<Order>(`/orders/${orderId}/verify-payment`, { method: 'POST', body: JSON.stringify(payload) }),
  markPaymentFailed: (orderId: string) => request<Order>(`/orders/${orderId}/payment-failed`, { method: 'POST' }),
  paymentConfig: () => request<{ razorpayEnabled: boolean; keyId: string; currency: string }>('/orders/payment-config'),
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => request<Product>('/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProduct: (id: string, values: Partial<Product>) => request<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(values) }),
  deleteProduct: (id: string) => request<void>(`/products/${id}`, { method: 'DELETE' }),
  updateContent: (content: Partial<SiteContent>) => request<SiteContent>('/content', { method: 'PATCH', body: JSON.stringify(content) }),
  updateOrderStatus: (id: string, status: Order['status']) => request<Order>(`/orders/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}
