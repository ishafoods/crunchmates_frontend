import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { Button, Stack, Typography } from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../store/useStore'

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: DashboardRoundedIcon },
  { to: '/admin/products', label: 'Products', icon: Inventory2RoundedIcon },
  { to: '/admin/content', label: 'Content', icon: EditNoteRoundedIcon },
  { to: '/admin/orders', label: 'Orders', icon: LocalShippingRoundedIcon },
]

export function AdminLayout() {
  const { admin, logoutAdmin } = useStore()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Stack spacing={1}>
          <p className="section-kicker">Admin workspace</p>
          <Typography variant="h4">Crunchmates CMS</Typography>
          <Typography className="muted">Separate login, editable content, product control, and order management.</Typography>
        </Stack>

        <nav className="admin-nav">
          {adminNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/admin'} className="admin-link">
                <Icon sx={{ fontSize: 18 }} /> {item.label}
              </NavLink>
            )
          })}
        </nav>

        <Button type="button" className="ghost-button" variant="outlined" onClick={logoutAdmin} startIcon={<LogoutRoundedIcon />}>
          Sign out
        </Button>

        <div className="admin-hint">
          Logged in as
          <strong>{admin?.email}</strong>
        </div>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  )
}
