import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { Button, TextField, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

export function CheckoutPage() {
  const { cart, products, cartTotal, placeOrder, user, loginUser } = useStore()
  const [submittedOrderId, setSubmittedOrderId] = useState('')
  const [form, setForm] = useState({
    customerName: user?.name ?? '',
    customerEmail: user?.email ?? '',
    address: '',
    city: '',
  })

  const items = useMemo(
    () =>
      cart
        .map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) }))
        .filter((item) => Boolean(item.product)),
    [cart, products],
  )

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!form.customerName || !form.customerEmail || !form.address || !form.city) {
      return
    }

    await loginUser({ name: form.customerName, email: form.customerEmail })
    const order = await placeOrder(form)

    if (order) {
      setSubmittedOrderId(order.id)
    }
  }

  if (submittedOrderId) {
    return (
      <div className="empty-state panel">
        <CheckCircleRoundedIcon sx={{ fontSize: 36 }} />
        <h1>Order placed</h1>
        <p>Your order {submittedOrderId} is now being prepared.</p>
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
          <TextField className="span-2" label="Address" multiline rows={3} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          <TextField label="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        </div>
        <Button type="submit" className="primary-button" variant="contained">
          Place order
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
