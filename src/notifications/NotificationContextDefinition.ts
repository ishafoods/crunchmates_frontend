import { createContext } from 'react'
import type { AlertColor } from '@mui/material'

export type NotifyOptions = { severity?: AlertColor }
export type NotificationApi = {
  notify: (message: string, options?: NotifyOptions) => void
  notifySuccess: (message: string) => void
  notifyError: (error: unknown, fallback?: string) => void
}

export const NotificationContext = createContext<NotificationApi | null>(null)
