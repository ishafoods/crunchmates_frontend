import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { SectionReveal } from '../components/SectionReveal'
import { useStore } from '../store/useStore'

export function ShowcasePage() {
  const { content, featuredProducts } = useStore()

  return (
    <div className="stack-xl showcase-page">
      <section className="showcase-hero panel">
        <div>
          <p className="eyebrow">THE CRUNCH GUIDE</p>
          <Typography variant="h1">Every crunch has a moment.</Typography>
          <p className="hero-text">Discover the Crunchmates range, simple ways to enjoy it, and the light popped texture behind every bold bite.</p>
          <Button component={Link} to="/shop" className="primary-button" variant="contained">
            Explore the range
          </Button>
        </div>
        {featuredProducts[0]?.image && <img src={featuredProducts[0].image} alt={featuredProducts[0].flavor} className="showcase-hero__image" />}
      </section>

      <SectionReveal>
        <section className="showcase-section">
          <div className="section-head compact">
            <div>
              <p className="section-kicker">The range</p>
              <Typography variant="h2">Find your kind of crunch.</Typography>
            </div>
            <p>From the launch flavour to the next drops, there is a Crunchmates moment for every mood.</p>
          </div>
          <div className="showcase-gallery">
            {content.showcaseImages.map((item, index) => (
              <article key={item.id} className="showcase-gallery__item">
                <img src={item.image} alt={item.title} />
                <div>
                  <span>{index < featuredProducts.length ? featuredProducts[index]?.badge : 'Crunchmates'}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* <SectionReveal>
        <section className="showcase-section showcase-serving">
          <div className="section-head compact">
            <div>
              <p className="section-kicker">How to enjoy</p>
              <Typography variant="h2">Make snack time your own.</Typography>
            </div>
            <RestaurantRoundedIcon className="showcase-serving__icon" />
          </div>
          <div className="serving-ideas">
            {servingIdeas.map(({ title, text, Icon }) => (
              <article key={title} className="serving-idea">
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="showcase-note">For nutrition, ingredients, allergens, and serving information, always check the details printed on the product pack.</p>
        </section>
      </SectionReveal> */}
    </div>
  )
}