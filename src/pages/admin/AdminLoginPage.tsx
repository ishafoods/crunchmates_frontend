import type { FormEvent } from 'react'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

export function AdminLoginPage() {
  const { admin, loginAdmin } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: 'admin@crunchmates.com', password: 'admin123' })

  if (admin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const success = await loginAdmin(form.email, form.password)
    if (!success) {
      setError('Use the demo admin credentials shown on this page.')
      return
    }

    const from =
      typeof location.state === 'object' && location.state && 'from' in location.state
        ? String(location.state.from)
        : '/admin'

    navigate(from)
  }

  return (
    <div className="admin-login-shell">
      <div className="panel auth-panel admin-auth-panel">
        <p className="section-kicker">Admin login</p>
        <h1>Sign in to manage the store.</h1>
        <p>Separate from customer login so the admin workspace stays isolated.</p>

        <div className="credential-card">
          <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} /> Demo credentials
          <strong>admin@crunchmates.com</strong>
          <strong>admin123</strong>
        </div>

        <Stack component="form" className="auth-form" onSubmit={handleSubmit} spacing={2}>
          <TextField label="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Button type="submit" className="primary-button" variant="contained" startIcon={<VerifiedUserRoundedIcon />}>
            Enter admin
          </Button>
        </Stack>
      </div>
    </div>
  )
}
