import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { admin } = useStore()
  const location = useLocation()

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
