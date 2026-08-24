import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { Button, TextField } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { useStore } from '../store/useStore'

export function ShopPage() {
  const { products } = useStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...new Set(products.map((product) => product.category))]

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = `${product.name} ${product.flavor} ${product.description}`
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesFilter = filter === 'All' || product.category === filter
      return matchesQuery && matchesFilter
    })
  }, [filter, products, query])

  return (
    <div className="stack-lg">
      <section className="section-head">
        <div>
          <p className="section-kicker">Shop</p>
          <h1>Find the flavor lane that fits the moment.</h1>
        </div>
        <div className="search-box">
          <SearchRoundedIcon sx={{ fontSize: 16 }} />
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search flavors"
            variant="standard"
            slotProps={{ input: { disableUnderline: true } }}
          />
        </div>
      </section>

      <div className="chip-row">
        {categories.map((item) => (
          <Button
            key={item}
            type="button"
            className={`filter-chip ${filter === item ? 'active' : ''}`}
            onClick={() => setFilter(item)}
            variant={filter === item ? 'contained' : 'outlined'}
            color={filter === item ? 'primary' : 'inherit'}
          >
            {item}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.section className="product-grid" layout>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.section>
      </AnimatePresence>
    </div>
  )
}
