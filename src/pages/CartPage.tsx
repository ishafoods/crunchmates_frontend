import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { Button, IconButton, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useNotification } from '../notifications/useNotification'

export function CartPage() {
  const { cart, products, cartTotal, updateCartQuantity, removeFromCart } = useStore()
  const { notifySuccess, notifyError } = useNotification()

  const handleQuantity = async (productId: string, quantity: number) => {
    try {
      await updateCartQuantity(productId, quantity)
    } catch (error) {
      notifyError(error, 'Unable to update the quantity')
    }
  }

  const handleRemove = async (productId: string, flavor: string) => {
    try {
      await removeFromCart(productId)
      notifySuccess(`${flavor} removed from cart`)
    } catch (error) {
      notifyError(error, 'Unable to remove this item')
    }
  }

  const items = cart
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId),
    }))
    .filter((item) => Boolean(item.product))

  if (!items.length) {
    return (
      <div className="empty-state panel">
        <LocalMallRoundedIcon sx={{ fontSize: 32 }} />
        <h1>Your cart is empty</h1>
        <p>Add a flavor from the shop to continue to checkout.</p>
        <Button component={Link} to="/shop" className="primary-button" variant="contained">
          Shop flavors
        </Button>
      </div>
    )
  }

  return (
    <div className="stack-lg">
      <section className="section-head">
        <div>
          <p className="section-kicker">Cart</p>
          <h1>Review your snack stack.</h1>
        </div>
        <Button component={Link} to="/checkout" className="primary-button" variant="contained">
          Go to checkout
        </Button>
      </section>

      <section className="cart-grid">
        <div className="panel cart-list">
          {items.map(({ product, quantity }) => {
            if (!product) {
              return null
            }

            return (
              <article key={product.id} className="cart-item">
                <div>
                  <p className="section-kicker">{product.flavor}</p>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>INR {product.price}</Typography>
                </div>

                <div className="quantity-row">
                  <IconButton type="button" onClick={() => void handleQuantity(product.id, quantity - 1)}>
                    <RemoveRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <strong>{quantity}</strong>
                  <IconButton type="button" onClick={() => void handleQuantity(product.id, quantity + 1)}>
                    <AddRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </div>

                <Button type="button" className="ghost-button" variant="outlined" onClick={() => void handleRemove(product.id, product.flavor)} startIcon={<DeleteOutlineRoundedIcon />}>
                  Remove
                </Button>
              </article>
            )
          })}
        </div>

        <aside className="panel summary-card">
          <p className="section-kicker">Summary</p>
          <Typography variant="h4">INR {cartTotal}</Typography>
          <p>Taxes and shipping are calculated at checkout.</p>
          <Button component={Link} to="/checkout" className="primary-button" variant="contained">
            Continue
          </Button>
        </aside>
      </section>
    </div>
  )
}
