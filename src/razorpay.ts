import type { RazorpayOrderInfo } from './api'

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

export type RazorpaySuccess = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type RazorpayInstance = { open: () => void; on: (event: string, handler: (payload: unknown) => void) => void }
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

let loader: Promise<RazorpayConstructor> | null = null

export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (loader) return loader
  loader = new Promise<RazorpayConstructor>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Razorpay checkout unavailable')))
    script.onerror = () => {
      loader = null
      reject(new Error('Unable to load Razorpay checkout'))
    }
    document.body.appendChild(script)
  })
  return loader
}

export type CheckoutOptions = {
  order: RazorpayOrderInfo
  name: string
  description: string
  prefill: { name: string; email: string; contact: string }
}

/** Resolves with the signed payment payload, or null when the customer dismisses the modal. */
export async function openRazorpayCheckout({ order, name, description, prefill }: CheckoutOptions) {
  const Razorpay = await loadRazorpay()
  return new Promise<RazorpaySuccess | null>((resolve, reject) => {
    let settled = false
    const checkout = new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name,
      description,
      prefill,
      theme: { color: '#f2a03d' },
      handler: (response: RazorpaySuccess) => {
        settled = true
        resolve(response)
      },
      modal: {
        ondismiss: () => {
          if (!settled) resolve(null)
        },
      },
    })
    checkout.on('payment.failed', (payload: unknown) => {
      settled = true
      const description = (payload as { error?: { description?: string } })?.error?.description
      reject(new Error(description ?? 'Payment failed'))
    })
    checkout.open()
  })
}
