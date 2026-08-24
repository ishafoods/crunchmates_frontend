import type { Product, SiteContent } from '../types'
import chip1 from '../assets/chip1.jpeg'
import chip2 from '../assets/chip2.jpeg'
import chip3 from '../assets/chip3.jpeg'
import chip4 from '../assets/chip4.jpeg'

export const defaultProducts: Product[] = [
  {
    id: 'indian-spice-punch',
    slug: 'indian-spice-punch',
    name: 'Crunchmates Rice Crisps',
    flavor: 'Indian Spice Punch',
    tagline: 'Bold spice. Big crunch.',
    description:
      'A light, crispy rice snack with a bold Indian Spice Punch and a seriously satisfying crunch.',
    price: 0,
    priceNote: 'Price available at checkout',
    badge: 'Launch Flavor',
    category: 'Rice Crisps',
    ingredients: ['Information coming soon'],
    features: ['Rice Crisps', 'Indian Spice Punch', 'Popped, Not Fried Nor Baked'],
    nutrition: ['Information coming soon'],
    tone: {
      background: 'linear-gradient(160deg, #063BCE 0%, #031B72 100%)',
      accent: '#E21B12',
      highlight: '#FFC928',
    },
    featured: true,
    image: chip2,
  },
  {
    id: 'coming-soon-1',
    slug: 'coming-soon-1',
    name: 'Crunchmates Rice Crisps',
    flavor: 'Coming Soon',
    tagline: 'Next crunch drop loading.',
    description: 'New flavor reveal coming soon.',
    price: 0,
    priceNote: 'Price to be announced',
    badge: 'Coming Soon',
    category: 'Rice Crisps',
    ingredients: ['Information coming soon'],
    features: ['CRISPY', 'BOLD', 'COMING SOON'],
    nutrition: ['Information coming soon'],
    tone: {
      background: 'linear-gradient(160deg, #008CFF 0%, #063BCE 100%)',
      accent: '#FFC928',
      highlight: '#FFF8E8',
    },
    featured: false,
    comingSoon: true,
    image: chip3,
  },
  {
    id: 'coming-soon-2',
    slug: 'coming-soon-2',
    name: 'Crunchmates Rice Crisps',
    flavor: 'Coming Soon',
    tagline: 'Another flavor is on the way.',
    description: 'New flavor reveal coming soon.',
    price: 0,
    priceNote: 'Price to be announced',
    badge: 'Coming Soon',
    category: 'Rice Crisps',
    ingredients: ['Information coming soon'],
    features: ['CRISPY', 'BOLD', 'COMING SOON'],
    nutrition: ['Information coming soon'],
    tone: {
      background: 'linear-gradient(160deg, #031B72 0%, #063BCE 100%)',
      accent: '#E21B12',
      highlight: '#FFC928',
    },
    featured: false,
    comingSoon: true,
    image: chip4,
  },
  {
    id: 'coming-soon-3',
    slug: 'coming-soon-3',
    name: 'Crunchmates Rice Crisps',
    flavor: 'Coming Soon',
    tagline: 'More crunch stories ahead.',
    description: 'New flavor reveal coming soon.',
    price: 0,
    priceNote: 'Price to be announced',
    badge: 'Coming Soon',
    category: 'Rice Crisps',
    ingredients: ['Information coming soon'],
    features: ['CRISPY', 'BOLD', 'COMING SOON'],
    nutrition: ['Information coming soon'],
    tone: {
      background: 'linear-gradient(160deg, #063BCE 0%, #008CFF 100%)',
      accent: '#A90000',
      highlight: '#FFC928',
    },
    featured: false,
    comingSoon: true,
    image: chip1,
  },
]

export const defaultContent: SiteContent = {
  announcement: 'BOLD SPICE. BIG CRUNCH. Crunchmates Rice Crisps - Indian Spice Punch.',
  heroEyebrow: 'MEET YOUR NEW CRUNCHMATE',
  heroTitle: 'BOLD SPICE.\nBIG CRUNCH.',
  heroSubtitle:`Crunchmates Rice Crisps bring together a light, crispy texture with an exciting Indian Spice Punch. Every bite delivers a satisfying crunch followed by a burst of spicy, aromatic flavour.\n

Why you’ll love them:

🔥 Indian Spice Punch – A lively blend inspired by bold Indian flavours.
🌾 Rice Crisps – Light, crunchy and made for easy snacking.
💥 Popped, Not Fried or Baked – The pack highlights a popping process rather than traditional frying or baking.
😋 Big Crunch, Big Flavour – Designed for those who like their snacks crispy and flavourful.
🫖 Perfect Anytime Snack – Enjoy with chai, during movie nights, at work, or whenever a spicy craving hits.
🌶️ Desi-Inspired Flavour – The chilli, spices and aromatic ingredients shown on the pack give it a distinctly Indian character`,
    // 'Crunchmates Rice Crisps are a fun, flavour-packed snack made for serious crunch lovers. Popped rather than fried or baked, these crispy bites combine a light texture with a bold Indian-inspired spice punch. Perfect for tea-time, travel, movie nights, parties, or whenever you’re craving something crunchy and chatpata.For factual product specifications such as ingredients, nutrition, weight, allergens, shelf life, or health claims, I’d recommend using the information printed on the actual pack rather than guessing; similar Indian-spiced rice crisps can have quite different formulations.',
  primaryCta: 'SHOP NOW',
  secondaryCta: 'DISCOVER THE CRUNCH',
  storyTitle: 'EVERY GREAT SNACK NEEDS A LITTLE ATTITUDE.',
  storyText:
    'Crunchmates is built around one simple idea: snacks should be fun. Bold flavours, satisfying crunch and a little Indian spice energy come together to create a snack made for modern snack lovers.',
  stats: [
    { label: 'Texture', value: 'POPPED' },
    { label: 'Flavour', value: 'BOLD' },
    { label: 'Style', value: 'SPICY' },
  ],
  showcaseImages: [
    { id: 'showcase-1', image: chip1, title: 'A crisp start', text: 'Light texture, ready for a bold bite.' },
    { id: 'showcase-2', image: chip2, title: 'Indian Spice Punch', text: 'The signature flavour with a lively kick.' },
    { id: 'showcase-3', image: chip3, title: 'Next flavour loading', text: 'Keep an eye out for the next crunch drop.' },
    { id: 'showcase-4', image: chip4, title: 'More ways to crunch', text: 'A snack for every mood and moment.' },
    { id: 'showcase-5', image: chip2, title: 'Tea break favourite', text: 'Made for pairing with your chai.' },
    { id: 'showcase-6', image: chip1, title: 'Shareable crunch', text: 'Bring a bowl to the table and share.' },
    { id: 'showcase-7', image: chip3, title: 'On-the-go snack', text: 'A crispy companion for busy days.' },
  ],
  spiceMeterTitle: 'Heat with balance, crunch with attitude.',
  spiceMeterText: 'Indian Spice Punch is tuned to feel bold and snackable, not overwhelming.',
  spiceMeterValue: 78,
  spiceMeterStartLabel: 'Mild',
  spiceMeterEndLabel: 'Bold',
  snackMomentsTitle: 'Built for every crunchy situation.',
  snackMoments: ['Movie Nights', 'Tea Breaks', 'Road Trips', 'Party Bowls'],
  socialProofTitle: 'What snack fans say',
  socialProofQuotes: [
    '“Unexpectedly crunchy. Instantly addictive.”',
    '“That spice lift is exactly what snack time needed.”',
    '“Finally, a rice crisp that feels fun and bold.”',
  ],
  newsletterTitle: 'Get first bite updates.',
  newsletterText: 'Flavor drops, launch news, and snack stories - straight to your inbox.',
  newsletterCta: 'JOIN THE LIST',
  finalCtaTitle: 'Ready for the crunch upgrade?',
  finalCtaPrimary: 'SHOP INDIAN SPICE PUNCH',
  finalCtaSecondary: 'EXPLORE COMING SOON',
  blocks: [
    {
      id: 'rice-crisps',
      title: 'RICE CRISPS',
      text: 'Light, crispy and seriously satisfying.',
      accent: '#FFC928',
    },
    {
      id: 'spice-punch',
      title: 'INDIAN SPICE PUNCH',
      text: 'Bold flavour inspired by the excitement of Indian spices.',
      accent: '#E21B12',
    },
    {
      id: 'popped',
      title: 'POPPED',
      text: 'Popped, not fried nor baked - the kind of crunch that keeps you reaching for another.',
      accent: '#008CFF',
    },
    {
      id: 'crunch-energy',
      title: 'BIG CRUNCH ENERGY',
      text: 'Made for snack attacks, sharing sessions and everything in between.',
      accent: '#FFC928',
    },
  ],
}
