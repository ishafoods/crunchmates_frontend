import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { Alert, Button, CircularProgress, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useNotification } from '../notifications/useNotification'
import { api } from '../api'
import { loadRazorpay } from '../razorpay'
import type { PaymentMethod } from '../types'

export function CheckoutPage() {
  const { cart, products, cartTotal, placeOrder, user, loginUser } = useStore()
  const { notifySuccess, notifyError } = useNotification()
  const [submittedOrderId, setSubmittedOrderId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [onlinePaymentAvailable, setOnlinePaymentAvailable] = useState(true)
  const [form, setForm] = useState({
    customerName: user?.name ?? '',
    customerEmail: user?.email ?? '',
    customerPhone: '',
    address: '',
    city: '',
    paymentMethod: 'razorpay' as PaymentMethod,
  })

  useEffect(() => {
    let active = true
    api
      .paymentConfig()
      .then((config) => {
        if (!active) return
        setOnlinePaymentAvailable(config.razorpayEnabled)
        if (!config.razorpayEnabled) setForm((current) => ({ ...current, paymentMethod: 'cod' }))
        else void loadRazorpay().catch(() => undefined)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  const items = useMemo(
    () =>
      cart
        .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
        .filter((item) => Boolean(item.product)),
    [cart, products],
  )

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!form.customerName || !form.customerEmail || !form.customerPhone || !form.address || !form.city) {
      setError('Fill in every checkout field before paying.')
      notifyError(null, 'Fill in every checkout field before paying.')
      return
    }

    if (!/^\+?[0-9]{10,15}$/.test(form.customerPhone.replace(/[\s-]/g, ''))) {
      setError('Enter a valid phone number so we can text your order updates.')
      notifyError(null, 'Enter a valid phone number so we can text your order updates.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await loginUser({ name: form.customerName, email: form.customerEmail })
      const order = await placeOrder(form)

      if (order) {
        setSubmittedOrderId(order.id)
        notifySuccess(
          form.paymentMethod === 'cod'
            ? `Order ${order.id} placed. Pay on delivery.`
            : `Payment successful. Order ${order.id} confirmed.`,
        )
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Payment could not be completed'
      setError(message)
      notifyError(cause, 'Payment could not be completed')
    } finally {
      setSubmitting(false)
    }
  }

  if (submittedOrderId) {
    return (
      <div className="empty-state panel">
        <CheckCircleRoundedIcon sx={{ fontSize: 36 }} />
        <h1>Order placed</h1>
        <p>
          Your order {submittedOrderId} is now being prepared.
          {form.paymentMethod === 'cod' ? ' Pay in cash when it arrives.' : ' Your payment was received.'}
        </p>
        <p>A confirmation email and SMS with the order details are on their way.</p>
        <Button component={Link} to="/account" className="primary-button" variant="contained">
          View account
        </Button>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="empty-state panel">
        <LockRoundedIcon sx={{ fontSize: 36 }} />
        <h1>No items to checkout</h1>
        <p>Add a product first so the checkout flow has something to process.</p>
        <Button component={Link} to="/shop" className="primary-button" variant="contained">
          Back to shop
        </Button>
      </div>
    )
  }

  return (
    <div className="checkout-grid">
      <form className="panel checkout-form" onSubmit={handleSubmit}>
        <p className="section-kicker">Checkout</p>
        <h1>Ship the crunch.</h1>
        <div className="form-grid">
          <TextField label="Name" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} />
          <TextField label="Email" value={form.customerEmail} onChange={(event) => setForm({ ...form, customerEmail: event.target.value })} />
          <TextField label="Phone" helperText="Order updates are texted here" value={form.customerPhone} onChange={(event) => setForm({ ...form, customerPhone: event.target.value })} />
          <TextField className="span-2" label="Address" multiline rows={3} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          <TextField label="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        </div>

        <div className="stack-sm">
          <p className="section-kicker">Payment</p>
          <RadioGroup
            value={form.paymentMethod}
            onChange={(event) => setForm({ ...form, paymentMethod: event.target.value as PaymentMethod })}
          >
            <FormControlLabel
              value="razorpay"
              control={<Radio />}
              disabled={!onlinePaymentAvailable}
              label={onlinePaymentAvailable ? 'Pay online with Razorpay (UPI, cards, netbanking)' : 'Pay online with Razorpay (unavailable)'}
            />
            <FormControlLabel value="cod" control={<Radio />} label="Cash on delivery" />
          </RadioGroup>
        </div>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Button
          type="submit"
          className="primary-button"
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <LockRoundedIcon />}
        >
          {submitting ? 'Processing' : form.paymentMethod === 'razorpay' ? `Pay INR ${cartTotal}` : 'Place order'}
        </Button>
      </form>

      <aside className="panel summary-card">
        <p className="section-kicker">Order summary</p>
        <div className="summary-lines">
          {items.map(({ product, quantity }) =>
            product ? (
              <div key={product.id}>
                <span>
                  {product.flavor} x {quantity}
                </span>
                <strong>INR {product.price * quantity}</strong>
              </div>
            ) : null,
          )}
        </div>
        <div className="summary-total">
          <span>Total</span>
          <Typography component="strong">INR {cartTotal}</Typography>
        </div>
      </aside>
    </div>
  )
}
