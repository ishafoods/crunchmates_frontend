import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded'
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductVisual } from '../components/ProductVisual'
import { useStore } from '../store/useStore'
import { useNotification } from '../notifications/useNotification'

export function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { productsBySlug, addToCart } = useStore()
  const { notifySuccess, notifyError } = useNotification()
  const product = slug ? productsBySlug[slug] : undefined
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="empty-state panel">
        <h1>Flavor not found</h1>
        <p>The product you requested does not exist in this storefront yet.</p>
        <Link to="/shop" className="primary-button">
          Back to shop
        </Link>
      </div>
    )
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity)
      notifySuccess(`${quantity} x ${product.flavor} added to cart`)
    } catch (error) {
      notifyError(error, 'Unable to add this item to your cart')
    }
  }

  return (
    <div className="product-detail">
      <Button type="button" className="text-link back-link" variant="text" onClick={() => navigate(-1)} startIcon={<ArrowBackRoundedIcon />}>
        Back
      </Button>

      <section className="product-detail__grid">
        <motion.div
          className="panel product-detail__visual"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ProductVisual product={product} size="large" />
        </motion.div>

        <motion.div
          className="panel product-detail__copy"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="section-kicker">{product.category}</p>
          <h1>{product.flavor}</h1>
          <p className="hero-text">{product.description}</p>

          <div className="detail-price">
            <Typography component="strong">
              <CurrencyRupeeRoundedIcon sx={{ fontSize: 18, verticalAlign: 'middle' }} />{' '}
              {product.price > 0 ? product.price : product.priceNote ?? 'Price at checkout'}
            </Typography>
            <span>{product.badge}</span>
          </div>

          <div className="pill-row">
            {product.features.map((feature) => (
              <span key={feature} className="stat-chip">
                {feature}
              </span>
            ))}
          </div>

          <div className="copy-grid">
            <Stack direction="row" spacing={0.8} className="qty-selector" sx={{ alignItems: 'center' }}>
              <Typography>Quantity</Typography>
              <IconButton type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                <RemoveRoundedIcon />
              </IconButton>
              <Typography>{quantity}</Typography>
              <IconButton type="button" onClick={() => setQuantity((value) => value + 1)}>
                <AddRoundedIcon />
              </IconButton>
            </Stack>
          </div>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} className="hero-actions">
            <Button
              type="button"
              className="primary-button"
              variant="contained"
              onClick={() => void handleAddToCart()}
              startIcon={<LocalMallRoundedIcon />}
            >
              Add to cart
            </Button>
            <Button component={Link} to="/checkout" className="secondary-button" variant="outlined">
              Buy now
            </Button>
          </Stack>

          <Accordion className="detail-accordion">
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              Ingredients
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                {product.ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion className="detail-accordion">
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              Nutrition
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                {product.nutrition.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion className="detail-accordion">
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              Allergen Information
            </AccordionSummary>
            <AccordionDetails>Information coming soon.</AccordionDetails>
          </Accordion>

          <Accordion className="detail-accordion">
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              Storage Advice
            </AccordionSummary>
            <AccordionDetails>Information coming soon.</AccordionDetails>
          </Accordion>
        </motion.div>
      </section>
    </div>
  )
}
