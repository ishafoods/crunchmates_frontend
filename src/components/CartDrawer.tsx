import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useNotification } from '../notifications/useNotification'

type Props = {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: Props) {
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

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 420 },
            background: '#ffffff',
            color: '#14110f',
            p: 2,
          },
        },
      }}
    >
      <Stack spacing={2} sx={{ height: '100%' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">YOUR CRUNCH BAG</Typography>
          <IconButton onClick={onClose} sx={{ color: 'text.primary' }}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <Divider />

        <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          {!items.length ? (
            <Typography sx={{ color: 'text.secondary' }}>Your crunch bag is empty.</Typography>
          ) : (
            items.map(({ product, quantity }) => {
              if (!product) {
                return null
              }

              return (
                <Stack
                  key={product.id}
                  direction="row"
                  spacing={1.2}
                  sx={{
                    alignItems: 'center',
                    border: '1px solid rgba(20,17,15,0.12)',
                    borderRadius: '18px',
                    p: 1,
                    background: '#fbf9f5',
                  }}
                >
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.flavor}
                    sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>{product.flavor}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {product.price > 0 ? `INR ${product.price}` : product.priceNote ?? 'Price TBA'}
                    </Typography>
                    <Stack direction="row" spacing={0.8} sx={{ mt: 0.6, alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => void handleQuantity(product.id, quantity - 1)}
                        sx={{ color: 'text.primary', border: '1px solid rgba(20,17,15,0.16)' }}
                      >
                        <RemoveRoundedIcon fontSize="small" />
                      </IconButton>
                      <Typography>{quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => void handleQuantity(product.id, quantity + 1)}
                        sx={{ color: 'text.primary', border: '1px solid rgba(20,17,15,0.16)' }}
                      >
                        <AddRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  <IconButton onClick={() => void handleRemove(product.id, product.flavor)} sx={{ color: 'text.primary' }}>
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                </Stack>
              )
            })
          )}
        </Stack>

        <Divider />

        <Stack spacing={1.2}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'text.secondary' }}>Subtotal</Typography>
            <Typography variant="h6">INR {cartTotal}</Typography>
          </Stack>
          <Button
            component={Link}
            to="/checkout"
            onClick={onClose}
            variant="contained"
            sx={{
              minHeight: 48,
              background: 'linear-gradient(135deg, #ff9f1a 0%, #e2231a 100%)',
              color: '#ffffff',
            }}
          >
            CHECKOUT →
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  )
}
