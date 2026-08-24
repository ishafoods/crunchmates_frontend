import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { Button, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useStore } from '../store/useStore'

export function AccountPage() {
  const { user, loginUser, logoutUser, orders } = useStore()
  const [mode, setMode] = useState<'login' | 'register'>(user ? 'login' : 'login')
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '' })

  const accountOrders = useMemo(
    () => (user ? orders.filter((order) => order.customerEmail === user.email) : []),
    [orders, user],
  )

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!form.name || !form.email) {
      return
    }

    await loginUser({ name: form.name, email: form.email })
  }

  if (user) {
    return (
      <div className="stack-lg">
        <section className="section-head">
          <div>
            <p className="section-kicker">Account</p>
            <h1>Welcome back, {user.name}.</h1>
          </div>
          <Button type="button" className="ghost-button" variant="outlined" onClick={logoutUser} startIcon={<LogoutRoundedIcon />}>
            Sign out
          </Button>
        </section>

        <section className="panel account-grid">
          <div>
            <p className="section-kicker">Profile</p>
            <Typography variant="h6">{user.email}</Typography>
            <p>Saved customer profile for faster checkout.</p>
          </div>
          <div>
            <p className="section-kicker">Orders</p>
            <Typography variant="h6">{accountOrders.length}</Typography>
            <p>Past purchases tracked in this browser.</p>
          </div>
        </section>

        <section className="panel">
          <div className="section-head compact">
            <div>
              <p className="section-kicker">Order history</p>
              <h2>Recent purchases</h2>
            </div>
          </div>
          <div className="orders-list">
            {accountOrders.length ? (
              accountOrders.map((order) => (
                <article key={order.id} className="order-card">
                  <div>
                    <h3>{order.id}</h3>
                    <p>
                      {order.items.length} items and {order.status}
                    </p>
                  </div>
                  <strong>INR {order.total}</strong>
                </article>
              ))
            ) : (
              <p>No orders yet.</p>
            )}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="auth-panel panel">
      <div>
        <p className="section-kicker">Customer login</p>
        <h1>Sign in or create an account.</h1>
        <p>Use this account area for faster checkout and order history.</p>
      </div>

      <ToggleButtonGroup
        className="tab-row"
        exclusive
        value={mode}
        onChange={(_, value) => {
          if (value) {
            setMode(value)
          }
        }}
      >
        <ToggleButton value="login">Login</ToggleButton>
        <ToggleButton value="register">Register</ToggleButton>
      </ToggleButtonGroup>

      <form className="form-grid auth-form" onSubmit={handleSubmit}>
        <TextField label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <TextField label="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Button type="submit" className="primary-button" variant="contained" startIcon={<LoginRoundedIcon />}>
          {mode === 'login' ? 'Login' : 'Create account'}
        </Button>
      </form>
    </div>
  )
}
