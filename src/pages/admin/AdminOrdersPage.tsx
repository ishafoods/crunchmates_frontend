import { FormControl, MenuItem, Select, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'

const statuses = ['Processing', 'Packed', 'Shipped', 'Delivered'] as const

export function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore()

  return (
    <div className="stack-lg">
      <section className="section-head compact">
        <div>
          <p className="section-kicker">Orders</p>
          <h1>Track every customer purchase.</h1>
        </div>
      </section>

      <section className="panel stack-md">
        {orders.length ? (
          orders.map((order) => (
            <article key={order.id} className="admin-order-row">
              <div>
                <h3>{order.customerName}</h3>
                <p>
                  {order.customerEmail} and {order.city}
                </p>
                <p>
                  {order.items.length} items and {order.address}
                </p>
              </div>

              <div className="stack-sm align-end">
                <Typography component="strong">INR {order.total}</Typography>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={order.status}
                  onChange={(event) =>
                    updateOrderStatus(order.id, event.target.value as typeof order.status)
                  }
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                </FormControl>
              </div>
            </article>
          ))
        ) : (
          <p>No orders yet. Place a test order from checkout.</p>
        )}
      </section>
    </div>
  )
}
