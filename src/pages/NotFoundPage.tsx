import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="empty-state panel">
      <p className="section-kicker">404</p>
      <h1>Page not found</h1>
      <p>The route you opened is not part of the storefront yet.</p>
      <Link to="/" className="primary-button">
        Back home
      </Link>
    </div>
  )
}
