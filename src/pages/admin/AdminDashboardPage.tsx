import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded'
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import { Typography } from '@mui/material'
import { useStore } from '../../store/useStore'

export function AdminDashboardPage() {
  const { products, orders, content } = useStore()

  const metrics = [
    { label: 'Products', value: products.length, icon: InventoryRoundedIcon },
    { label: 'Orders', value: orders.length, icon: LocalMallRoundedIcon },
    { label: 'Editable blocks', value: content.blocks.length, icon: PostAddRoundedIcon },
    { label: 'Customer profiles', value: Math.max(orders.length, 1), icon: PeopleAltRoundedIcon },
  ]

  return (
    <div className="stack-lg">
      <section className="section-head compact">
        <div>
          <p className="section-kicker">Overview</p>
          <h1>Operate the brand from one dashboard.</h1>
        </div>
      </section>

      <section className="metric-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon

          return (
            <article key={metric.label} className="panel metric-card">
              <Icon sx={{ fontSize: 18 }} />
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          )
        })}
      </section>

      <section className="panel admin-note">
        <p className="section-kicker">Live content</p>
        <Typography variant="h4">{content.heroTitle}</Typography>
        <p>{content.heroSubtitle}</p>
      </section>
    </div>
  )
}
