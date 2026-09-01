import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import { Chip, Container, IconButton, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { CartDrawer } from './CartDrawer'
import { useStore } from '../store/useStore'
import logo from '../assets/logo-removebg-preview.png'
import Crunchmates from '../assets/crunchmates-removebg-preview.png'
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/showcase', label: 'Showcase' },
  // { to: '/#our-story', label: 'Our Story' },
  { to: '/#flavours', label: 'Flavours' },
  { to: '/#find-us', label: 'Find Us' },
]

export function SiteLayout() {
  const { cartCount, content } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClass = useMemo(
    () =>
      ({ isActive }: { isActive: boolean }) =>
        `site-link ${isActive ? 'active' : ''}`,
    [],
  )

  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb-one" />
      <div className="bg-orb bg-orb-two" />
      <div className="bg-orb bg-orb-three" />

      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
        <div className="announcement-bar">{content.announcement}</div>
        <Container maxWidth={false} disableGutters>
        <div className="nav-row">
          <NavLink to="/" className="brand-mark" onClick={() => setMenuOpen(false)}>
            <span >
              <img src={logo} alt="Crunchmates logo" width={32} height={32} />
            </span>
            <span>
              <img src={Crunchmates} alt="Crunchmates logo" width={130} height={32} />
              {/* <strong>Crunchmates</strong> */}
              <small>Crisps made with Rice & Corn</small>
            </span>
          </NavLink>

          <IconButton
            className="menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
          </IconButton>

          <nav className={`site-nav ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              item.to.includes('#') ? (
                <a key={item.to} href={item.to} className="site-link" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <NavLink key={item.to} to={item.to} className={navClass} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              )
            ))}
            <NavLink to="/admin/login" className="site-link" onClick={() => setMenuOpen(false)}>
              <DashboardRoundedIcon sx={{ fontSize: 18 }} /> Admin
            </NavLink>
          </nav>

          <Stack direction="row" spacing={1} className="site-actions">
            <NavLink to="/shop" className="icon-pill" aria-label="Search products">
              <SearchRoundedIcon sx={{ fontSize: 18 }} />
            </NavLink>
            <NavLink to="/account" className="icon-pill">
              <PersonRoundedIcon sx={{ fontSize: 18 }} />
            </NavLink>
            <button type="button" className="icon-pill cart-pill" onClick={() => setDrawerOpen(true)} aria-label="Open cart drawer">
              <LocalMallRoundedIcon sx={{ fontSize: 18 }} />
              <Chip label={cartCount} size="small" color="primary" sx={{ height: 24, '& .MuiChip-label': { px: 0.8 } }} />
            </button>
            <NavLink to="/shop" className="primary-button shop-now-pill">
              SHOP NOW
            </NavLink>
          </Stack>
        </div>
        </Container>
      </header>

      <main className="page-frame">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          <Outlet />
        </motion.div>
      </main>

      <footer className="site-footer">
         <section className="panel contact-panel" id="find-us">
          <div>
            <p className="section-kicker">Contact Us</p>
            <h2>Crunchmates Rice Crisps</h2>
            <p>For product inquiries, dealership opportunities, and business partnerships, reach out to our team today.</p>
          </div>
          <div className="contact-details">
            <a href="tel:+919491347764"><PhoneRoundedIcon /> <span>+91 9491347764</span></a>
            <a href="mailto:ishamanufactures2025@gmail.com"><EmailRoundedIcon /> <span>ishamanufactures2025@gmail.com</span></a>
            <span><LocationOnRoundedIcon /> <span>ISHA FOODS AND PRODUCTS HYDERABAD, INDIA</span></span>
          </div>
        </section>
        {/* <Box>
          <Typography component="strong">Crunchmates</Typography>
          <Typography>Bold spice. Big crunch.</Typography>
        </Box> */}
      </footer>
        <Typography style={{ textAlign: "center", margin: "1rem 1rem" }}>© 2026 Crunchmates. All rights reserved.</Typography>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
