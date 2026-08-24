import { createContext } from 'react'
import type { StoreApi } from './StoreContext'

export const StoreContext = createContext<StoreApi | null>(null)