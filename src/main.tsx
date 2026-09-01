import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { NotificationProvider } from './notifications/NotificationProvider'
import { StoreProvider } from './store/StoreContext'
import { appTheme } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <NotificationProvider>
          <StoreProvider>
            <App />
          </StoreProvider>
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
