import { useCallback, useEffect, useState } from 'react'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { ProductVisual } from './ProductVisual'
import type { Product } from '../types'

type Props = {
  products: Product[]
  autoPlayMs?: number
}

/** Signed distance from the active index on a wrapped ring, e.g. last -> first is -1. */
function ringOffset(index: number, active: number, length: number) {
  const raw = (index - active + length) % length
  return raw > length / 2 ? raw - length : raw
}

export function FlavorCarousel({ products, autoPlayMs = 5000 }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = products.length
  // Derived so the carousel stays valid when the catalog shrinks under it.
  const active = total ? Math.min(activeIndex, total - 1) : 0

  const goTo = useCallback(
    (index: number) => setActiveIndex(total ? ((index % total) + total) % total : 0),
    [total],
  )
  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const previous = useCallback(() => goTo(active - 1), [active, goTo])

  useEffect(() => {
    if (paused || total < 2 || autoPlayMs <= 0) return
    const timer = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % total),
      autoPlayMs,
    )
    return () => window.clearInterval(timer)
  }, [paused, total, autoPlayMs])

  if (!total) return null

  const activeProduct = products[active]

  return (
    <div
      className="flavor-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="flavor-carousel__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Featured flavors"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            previous()
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            next()
          }
        }}
      >
        {total > 1 && (
          <button
            type="button"
            className="flavor-carousel__arrow flavor-carousel__arrow--prev"
            onClick={previous}
            aria-label="Previous flavor"
          >
            <ArrowBackRoundedIcon />
          </button>
        )}

        <div className="flavor-carousel__track">
          {products.map((product, index) => {
            const offset = ringOffset(index, active, total)
            const distance = Math.abs(offset)
            // Anything past two steps out is parked at the edge so the ring stays readable.
            const clamped = Math.min(distance, 3)
            const isActive = distance === 0
            const step = clamped ? clamped * 130 + 130 : 0
            // vw cap keeps neighbours on screen at narrow widths.
            const shift = `calc(${Math.sign(offset)} * min(${step}px, ${clamped * 20 + (clamped ? 20 : 0)}vw))`

            return (
              <div
                key={product.id}
                className={`flavor-carousel__item ${isActive ? 'is-active' : ''}`}
                style={{
                  transform: `translateX(${shift}) scale(${1 - clamped * 0.26})`,
                  opacity: clamped >= 3 ? 0 : 1 - clamped * 0.25,
                  zIndex: total - clamped,
                  pointerEvents: clamped >= 3 ? 'none' : 'auto',
                }}
                aria-hidden={!isActive}
              >
                <button
                  type="button"
                  className="flavor-carousel__pack"
                  onClick={() => goTo(index)}
                  tabIndex={isActive ? -1 : 0}
                  aria-label={`Show ${product.flavor}`}
                >
                  <ProductVisual product={product} size={isActive ? 'large' : 'medium'} />
                </button>
              </div>
            )
          })}
        </div>

        {total > 1 && (
          <button
            type="button"
            className="flavor-carousel__arrow flavor-carousel__arrow--next"
            onClick={next}
            aria-label="Next flavor"
          >
            <ArrowForwardRoundedIcon />
          </button>
        )}
      </div>

      <div className="flavor-carousel__caption" aria-live="polite">
        <p className="section-kicker">{activeProduct.category}</p>
        <h3>{activeProduct.flavor}</h3>
        <p>{activeProduct.tagline}</p>
      </div>

      <Button
        component={Link}
        to={`/product/${activeProduct.slug}`}
        className="primary-button"
        variant="contained"
      >
        Shop {activeProduct.flavor}
      </Button>

      {total > 1 && (
        <div className="flavor-carousel__dots">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={`hero-showcase__dot ${index === active ? 'active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`Show ${product.flavor}`}
              aria-current={index === active ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
