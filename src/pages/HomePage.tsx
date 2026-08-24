import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import {
  Button,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { ProductVisual } from "../components/ProductVisual";
import { SectionReveal } from "../components/SectionReveal";
import { useStore } from "../store/useStore";

export function HomePage() {
  const { content, featuredProducts } = useStore();
  const [heroSlide, setHeroSlide] = useState(0);
  const heroProduct = featuredProducts[heroSlide] ?? featuredProducts[0];
  const comingSoon = featuredProducts.filter((product) => product.comingSoon);

  useEffect(() => {
    if (featuredProducts.length < 2) return;
    const timer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % featuredProducts.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [featuredProducts.length]);

  const showPreviousHeroSlide = () => {
    setHeroSlide((current) => (current - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const showNextHeroSlide = () => {
    setHeroSlide((current) => (current + 1) % featuredProducts.length);
  };

  const heroSubtitleLines = content.heroSubtitle
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const heroSubtitleLead = heroSubtitleLines[0] ?? "";
  const heroSubtitleBullets = heroSubtitleLines.filter((_, index) => index > 0);

  return (
    <div className="stack-xl">
      <section className="hero-grid" id="top">
        <motion.div
          className="hero-copy panel"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="eyebrow">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p className="hero-text">{heroSubtitleLead}</p>
          {heroSubtitleBullets.length > 0 && (
            <ul className="hero-subtitle-list">
              {heroSubtitleBullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            className="hero-actions"
          >
            <Button
              component={Link}
              to="/shop"
              className="primary-button"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              {content.primaryCta}
            </Button>
            <Button
              component={Link}
              to="#our-story"
              className="secondary-button"
              variant="outlined"
            >
              {content.secondaryCta}
            </Button>
          </Stack>
          <div className="hero-stats">
            {content.stats.map((stat) => (
              <div key={stat.label} className="stat-chip">
                <Grid container style={{width:"100%",alignItems:"center"}}>
                  <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    
                    <strong>{stat.value}</strong>
                    <br />
                    <span>{stat.label}</span>
                  </Grid>
                  <Grid style={{ textAlign: "right" }} size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    {stat.image && (
                      <img
                        className="stat-chip__image"
                        src={stat.image}
                        alt=""
                      />
                    )}
                  </Grid>
                </Grid>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-showcase panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="hero-showcase__orbit">
            <span />
            <span />
            <span />
          </div>
          {heroProduct && (
            <motion.div
              key={heroProduct.id}
              className="hero-showcase__slide"
              initial={{ opacity: 0, scale: 0.94, x: 18 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <ProductVisual product={heroProduct} size="large" />
              <div className="hero-showcase__product-meta">
                <strong>{heroProduct.flavor}</strong>
                <span>{heroProduct.badge}</span>
              </div>
            </motion.div>
          )}
          {featuredProducts.length > 1 && (
            <div className="hero-showcase__controls" aria-label="Featured products slider">
              <button type="button" className="hero-showcase__arrow" onClick={showPreviousHeroSlide} aria-label="Previous featured product">
                <ArrowBackRoundedIcon />
              </button>
              <div className="hero-showcase__dots">
                {featuredProducts.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    className={`hero-showcase__dot ${index === heroSlide ? "active" : ""}`}
                    onClick={() => setHeroSlide(index)}
                    aria-label={`Show ${product.flavor}`}
                    aria-current={index === heroSlide ? "true" : undefined}
                  />
                ))}
              </div>
              <button type="button" className="hero-showcase__arrow" onClick={showNextHeroSlide} aria-label="Next featured product">
                <ArrowForwardRoundedIcon />
              </button>
            </div>
          )}
          {/* <div className="hero-showcase__foot">
            <Chip
              icon={<BoltRoundedIcon />}
              label="Popped texture"
              className="mini-chip"
            />
            <Chip
              icon={<LocalFireDepartmentRoundedIcon />}
              label="Indian spice punch"
              className="mini-chip"
            />
          </div> */}
        </motion.div>
      </section>

      <SectionReveal>
        <section className="feature-strip" aria-label="Why Crunchmates">
          {content.blocks.map((block) => (
            <motion.article
              key={block.id}
              className="feature-card"
              whileHover={{ y: -4 }}
              style={{ ["--feature-accent" as string]: block.accent, alignContent: "center" }}
            >
              <Grid container>
                <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <span className="feature-dot" />
                  <h3>{block.title}</h3>
                  <p>{block.text}</p>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  {block.image && (
                    <img
                      className="feature-card__image"
                      src={block.image}
                      alt=""
                    />
                  )}
                </Grid>
              </Grid>
            </motion.article>
          ))}
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="panel spice-meter" id="flavours">
          <div>
            <p className="section-kicker">Spice Meter</p>
            <h2>{content.spiceMeterTitle}</h2>
            <p>{content.spiceMeterText}</p>
          </div>
          <div className="spice-meter__scale">
            <Typography variant="body2">
              {content.spiceMeterStartLabel}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={content.spiceMeterValue}
              sx={{
                height: 10,
                borderRadius: 99,
                backgroundColor: "rgba(255,255,255,0.18)",
                "& .MuiLinearProgress-bar": {
                  background:
                    "linear-gradient(90deg, #FFC928 0%, #E21B12 100%)",
                },
              }}
            />
            <Typography variant="body2">
              {content.spiceMeterEndLabel}
            </Typography>
          </div>
        </section>
      </SectionReveal>

      {/* {launchProduct && (
        <SectionReveal>
          <section className="panel launch-section">
            <div>
              <p className="section-kicker">Product Intro</p>
              <h2>{launchProduct.flavor}</h2>
              <p>{launchProduct.description}</p>
              <div className="pill-row">
                {launchProduct.features.map((feature) => (
                  <span key={feature} className="stat-chip">
                    {feature}
                  </span>
                ))}
              </div>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                className="hero-actions"
              >
                <Button
                  type="button"
                  className="primary-button"
                  variant="contained"
                  onClick={() => addToCart(launchProduct.id)}
                >
                  ADD TO BAG
                </Button>
                <Button
                  component={Link}
                  to={`/product/${launchProduct.slug}`}
                  className="secondary-button"
                  variant="outlined"
                >
                  VIEW DETAILS
                </Button>
              </Stack>
            </div>
            <ProductVisual product={launchProduct} size="medium" />
          </section>
        </SectionReveal>
      )} */}

      <SectionReveal>
        <section className="section-head">
          <div>
            <p className="section-kicker">Product Showcase</p>
            <Typography variant="h4">
              Current launch and next flavor drops
            </Typography>
          </div>
          <Button
            component={Link}
            to="/shop"
            className="text-link"
            variant="text"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Browse all flavors
          </Button>
        </section>
      </SectionReveal>

      <section className="product-grid">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <SectionReveal>
        <section className="panel snack-moments">
          <p className="section-kicker">Snack Moments</p>
          <h2>{content.snackMomentsTitle}</h2>
          <div className="snack-moments__grid">
            {content.snackMoments.map((moment) => (
              <article key={moment} className="feature-card compact">
                <CelebrationRoundedIcon sx={{ color: "#FFC928" }} />
                <h3>{moment}</h3>
              </article>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="story-panel panel" id="our-story">
          <div>
            <p className="section-kicker">Brand Story</p>
            <h2>{content.storyTitle}</h2>
          </div>
          <p>{content.storyText}</p>
          <div className="story-footer">
            <span>
              <RestaurantRoundedIcon sx={{ fontSize: 16 }} /> Built for modern
              snack lovers
            </span>
            <span>
              <GroupsRoundedIcon sx={{ fontSize: 16 }} /> Shareable flavor
              energy
            </span>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="panel social-proof">
          <p className="section-kicker">Social Buzz</p>
          <h2>{content.socialProofTitle}</h2>
          <div className="social-proof__grid">
            {content.socialProofQuotes.map((quote) => (
              <blockquote key={quote} className="feature-card compact">
                {quote}
              </blockquote>
            ))}
          </div>
        </section>
      </SectionReveal>
      <SectionReveal>
        <section className="panel final-cta">
          <h2>{content.finalCtaTitle}</h2>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            className="hero-actions"
          >
            <Button
              component={Link}
              to="/shop"
              className="primary-button"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              {content.finalCtaPrimary}
            </Button>
            {comingSoon.length > 0 && (
              <Button
                component={Link}
                to="/shop"
                className="secondary-button"
                variant="outlined"
              >
                {content.finalCtaSecondary}
              </Button>
            )}
          </Stack>
        </section>
      </SectionReveal>
    </div>
  );
}
