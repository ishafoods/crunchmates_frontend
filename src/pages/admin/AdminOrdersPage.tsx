import { FormControl, MenuItem, Select, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'
import { useNotification } from '../../notifications/useNotification'

const statuses = ['Processing', 'Packed', 'Shipped', 'Delivered'] as const

export function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore()
  const { notifySuccess, notifyError } = useNotification()

  const handleStatusChange = async (orderId: string, status: (typeof statuses)[number]) => {
    try {
      await updateOrderStatus(orderId, status)
      notifySuccess(`Order ${orderId} marked as ${status}`)
    } catch (error) {
      notifyError(error, 'Unable to update the order status')
    }
  }

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
                <p>{order.customerPhone}</p>
                <p>
                  {order.items.length} items and {order.address}
                </p>
                <p>
                  {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Razorpay'} and payment {order.paymentStatus ?? 'pending'}
                  {order.razorpayPaymentId ? ` (${order.razorpayPaymentId})` : ''}
                </p>
              </div>

              <div className="stack-sm align-end">
                <Typography component="strong">INR {order.total}</Typography>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={order.status}
                  onChange={(event) =>
                    void handleStatusChange(order.id, event.target.value as (typeof statuses)[number])
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
