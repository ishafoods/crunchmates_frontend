export type FlavorTone = {
  background: string
  accent: string
  highlight: string
}

export type Product = {
  id: string
  slug: string
  name: string
  flavor: string
  tagline: string
  description: string
  price: number
  priceNote?: string
  badge: string
  category: string
  ingredients: string[]
  features: string[]
  nutrition: string[]
  image?: string
  tone: FlavorTone
  featured: boolean
  comingSoon?: boolean
}

export type ContentBlock = {
  id: string
  title: string
  text: string
  accent: string
  image?: string
}

export type SiteStat = { label: string; value: string; image?: string }
export type ShowcaseImage = { id: string; image: string; title: string; text: string }

export type SiteContent = {
  announcement: string
  heroTitle: string
  heroSubtitle: string
  heroEyebrow: string
  primaryCta: string
  secondaryCta: string
  storyTitle: string
  storyText: string
  stats: SiteStat[]
  showcaseImages: ShowcaseImage[]
  blocks: ContentBlock[]
  spiceMeterTitle: string
  spiceMeterText: string
  spiceMeterValue: number
  spiceMeterStartLabel: string
  spiceMeterEndLabel: string
  snackMomentsTitle: string
  snackMoments: string[]
  socialProofTitle: string
  socialProofQuotes: string[]
  newsletterTitle: string
  newsletterText: string
  newsletterCta: string
  finalCtaTitle: string
  finalCtaPrimary: string
  finalCtaSecondary: string
}

export type CartItem = {
  productId: string
  quantity: number
}

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  customerName: string
  customerEmail: string
  address: string
  city: string
  status: 'Processing' | 'Packed' | 'Shipped' | 'Delivered'
  createdAt: string
  items: OrderItem[]
  total: number
}

export type UserProfile = {
  name: string
  email: string
}

export type AdminProfile = {
  email: string
}

export type CheckoutForm = {
  customerName: string
  customerEmail: string
  address: string
  city: string
}

export type ProductFormValues = {
  name: string
  flavor: string
  tagline: string
  description: string
  price: string
  badge: string
  category: string
  ingredients: string
  features: string
  nutrition: string
  background: string
  accent: string
  highlight: string
}
