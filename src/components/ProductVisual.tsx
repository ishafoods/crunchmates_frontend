import type { Product } from '../types'

type Props = {
  product: Product
  size?: 'small' | 'medium' | 'large'
}

export function ProductVisual({ product, size = 'medium' }: Props) {
  const resolvedImage = product.image ?? ''

  return (
    <div className={`product-visual product-visual--${size}`} style={{ background: product.tone.background }}>
      {product.image ? (
        <img
          src={resolvedImage}
          alt={product.flavor}
          className={`visual-icon`}
          style={{ width: 'inherit', height: 'inherit' }}
        />
      ) : (
        <>
          <div className="visual-rays" />
          <div className="visual-chip visual-chip--one" />
          <div className="visual-chip visual-chip--two" />
          <div className="visual-chip visual-chip--three" />
        </>
      )}
      <div className="visual-bowl">
        <div className="visual-title">{product.name}</div>
        <div className="visual-flavor">{product.flavor}</div>
      </div>
    </div>
  )
}
