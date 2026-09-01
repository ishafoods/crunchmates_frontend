import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Button, Chip, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useNotification } from '../notifications/useNotification'
import type { Product } from '../types'
import { ProductVisual } from './ProductVisual'

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore()
  const { notifySuccess, notifyError } = useNotification()

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id)
      notifySuccess(`${product.flavor} added to cart`)
    } catch (error) {
      notifyError(error, 'Unable to add this item to your cart')
    }
  }

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="product-card__top">
        <Chip label={product.badge} className="product-badge" size="small" />
        <Chip
          label={product.price > 0 ? `INR ${product.price}` : product.priceNote ?? 'Price TBA'}
          className="product-price"
          size="small"
        />
      </div>
      <ProductVisual product={product} size="small" />
      <div className="product-card__body">
        <p className="section-kicker">{product.category}</p>
        <Typography variant="h6">{product.flavor}</Typography>
        <Typography>{product.tagline}</Typography>
      </div>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} className="product-card__actions">
        <Button type="button" className="primary-button" variant="contained" onClick={() => void handleAddToCart()} startIcon={<AddRoundedIcon />}>
          Add to cart
        </Button>
        <Button component={Link} to={`/product/${product.slug}`} className="text-link" variant="text" endIcon={<ArrowForwardRoundedIcon />}>
          View details
        </Button>
      </Stack>
    </motion.article>
  )
}
