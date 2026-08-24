import type { ChangeEvent, FormEvent } from 'react'
import { useMemo, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { Button, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'
import type { Product } from '../../types'

const emptyForm = {
  name: '',
  flavor: '',
  tagline: '',
  description: '',
  price: '',
  badge: 'New',
  category: 'Spicy',
  ingredients: '',
  features: '',
  nutrition: '',
  background: '#ff9a1a',
  accent: '#ee5a14',
  highlight: '#fff0b1',
}

function readFileAsDataUrl(file: File) {
  return new Promise<string | undefined>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve(typeof reader.result === 'string' ? reader.result : undefined)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [form, setForm] = useState(emptyForm)

  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingId) ?? null,
    [editingId, products],
  )

  const resetForm = () => {
    setEditingId(null)
    setImageFile(null)
    setForm(emptyForm)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageFile(event.target.files?.[0] ?? null)
  }

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name} - ${product.flavor}?`)) {
      return
    }

    await deleteProduct(product.id)
    if (editingId === product.id) {
      resetForm()
    }
  }

  const populateForEdit = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      flavor: product.flavor,
      tagline: product.tagline,
      description: product.description,
      price: String(product.price),
      badge: product.badge,
      category: product.category,
      ingredients: product.ingredients.join(', '),
      features: product.features.join(', '),
      nutrition: product.nutrition.join(', '),
      background: '#ff9a1a',
      accent: '#ee5a14',
      highlight: '#fff0b1',
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const image = imageFile ? await readFileAsDataUrl(imageFile) : undefined

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: form.name,
        flavor: form.flavor,
        tagline: form.tagline,
        description: form.description,
        price: Number(form.price),
        badge: form.badge,
        category: form.category,
        ingredients: form.ingredients
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        features: form.features
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        nutrition: form.nutrition
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        tone: {
          background: `linear-gradient(160deg, ${form.background} 0%, ${form.accent} 100%)`,
          accent: form.accent,
          highlight: form.highlight,
        },
        image,
      })
    } else {
      await addProduct(form, image)
    }

    resetForm()
  }

  return (
    <div className="stack-lg">
      <section className="section-head compact">
        <div>
          <p className="section-kicker">Products</p>
          <h1>Manage flavors, cards, and uploaded art.</h1>
        </div>
      </section>

      <section className="admin-two-column">
        <form className="panel admin-form" onSubmit={handleSubmit}>
          <Typography variant="h5">{editingProduct ? 'Edit product' : 'Add product'}</Typography>
          <div className="form-grid">
            <TextField label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <TextField label="Flavor" value={form.flavor} onChange={(event) => setForm({ ...form, flavor: event.target.value })} />
            <TextField className="span-2" label="Tagline" value={form.tagline} onChange={(event) => setForm({ ...form, tagline: event.target.value })} />
            <TextField className="span-2" label="Description" multiline rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <TextField label="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            <TextField label="Badge" value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} />
            <TextField label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            <TextField className="span-2" label="Ingredients" value={form.ingredients} onChange={(event) => setForm({ ...form, ingredients: event.target.value })} />
            <TextField className="span-2" label="Features" value={form.features} onChange={(event) => setForm({ ...form, features: event.target.value })} />
            <TextField className="span-2" label="Nutrition" value={form.nutrition} onChange={(event) => setForm({ ...form, nutrition: event.target.value })} />
            <TextField label="Background" value={form.background} onChange={(event) => setForm({ ...form, background: event.target.value })} />
            <TextField label="Accent" value={form.accent} onChange={(event) => setForm({ ...form, accent: event.target.value })} />
            <TextField label="Highlight" value={form.highlight} onChange={(event) => setForm({ ...form, highlight: event.target.value })} />
            <div className="span-2">
              <Typography sx={{ mb: 1 }}>Artwork upload</Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
          <div className="hero-actions">
            <Button type="submit" className="primary-button" variant="contained" startIcon={<AddRoundedIcon />}>
              {editingProduct ? 'Save changes' : 'Add product'}
            </Button>
            <Button type="button" className="secondary-button" variant="outlined" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </form>

        <div className="panel admin-list">
          <Typography variant="h5">Catalog</Typography>
          <div className="admin-products-list">
            {products.map((product) => (
              <article key={product.id} className="admin-product-row">
                <div>
                  <p className="section-kicker">{product.flavor}</p>
                  <h3>{product.name}</h3>
                  <p>
                    INR {product.price} and {product.category}
                  </p>
                </div>
                <div className="hero-actions compact-actions">
                  <Tooltip title="Edit product">
                    <IconButton
                      type="button"
                      className="block-action-button"
                      aria-label={`Edit ${product.name} ${product.flavor}`}
                      onClick={() => populateForEdit(product)}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete product">
                    <IconButton
                      type="button"
                      className="block-action-button block-action-button--danger"
                      aria-label={`Delete ${product.name} ${product.flavor}`}
                      onClick={() => void handleDelete(product)}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
