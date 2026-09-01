import { useCallback, useMemo, useState } from 'react'
import type { AlertColor } from '@mui/material'
import { Alert, Snackbar } from '@mui/material'
import { NotificationContext, type NotifyOptions } from './NotificationContextDefinition'

type Toast = { key: number; message: string; severity: AlertColor }

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)
  const [open, setOpen] = useState(false)

  const notify = useCallback((message: string, options?: NotifyOptions) => {
    setToast({ key: Date.now(), message, severity: options?.severity ?? 'info' })
    setOpen(true)
  }, [])

  const value = useMemo(
    () => ({
      notify,
      notifySuccess: (message: string) => notify(message, { severity: 'success' }),
      notifyError: (error: unknown, fallback = 'Something went wrong. Please try again.') =>
        notify(error instanceof Error && error.message ? error.message : fallback, { severity: 'error' }),
    }),
    [notify],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast?.key}
        open={open}
        autoHideDuration={4000}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setOpen(false)
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast?.severity ?? 'info'}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{ width: '100%' }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}
