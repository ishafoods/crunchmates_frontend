import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { Button, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FlavorCarousel } from "../components/FlavorCarousel";
import { ProductVisual } from "../components/ProductVisual";
import { SectionReveal } from "../components/SectionReveal";
import { useStore } from "../store/useStore";
import Img from "../assets/crunchmates-removebg-preview.png";

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
    setHeroSlide(
      (current) => (current - 1 + featuredProducts.length) % featuredProducts.length,
    );
  };

  const showNextHeroSlide = () => {
    setHeroSlide((current) => (current + 1) % featuredProducts.length);
  };

  const heroSubtitleLines = content.heroSubtitle
    .split("\n")
    .map((line) => (
      <>
        <br />
        {line}
      </>
    ))
    .filter(Boolean);
  const heroSubtitleLead = heroSubtitleLines[0] ?? "";
  const heroSubtitleBullets = heroSubtitleLines.filter((_, index) => index > 0);

  return (
    <div className="stack-xl">
      <section id="top">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <img className="cc-center" src={Img} alt="Crunchmates" />
          {/* <p className="eyebrow cc-center">{content.heroEyebrow}</p> */}
          <p className="eyebrow cc-center" style={{ fontFamily: "cursive" }}>
            {content.heroTitle}
          </p>
          {/* <h2 className="cc-center">{content.heroTitle}</h2> */}
          <p
            className="hero-text cc-center"
            style={{ width: "55rem", fontSize: "22px", textAlign: "center" }}
          >
            {heroSubtitleLead}
          </p>
          {/* {heroSubtitleBullets.length > 0 && (
            <ul className="hero-subtitle-list">
              {heroSubtitleBullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )} */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            className="hero-actions cc-center"
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
            {/* <Button
              component={Link}
              to="#our-story"
              className="secondary-button"
              variant="outlined"
            >
              {content.secondaryCta}
            </Button> */}
          </Stack>
          <div className="hero-stats">
            {content.stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="stat-chip">
                <Grid container style={{ width: "100%", alignItems: "center" }}>
                  <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <strong>{stat.value}</strong>
                    <br />
                    <span>{stat.label}</span>
                  </Grid>
                  <Grid style={{ textAlign: "right" }} size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    {stat.image && <img className="stat-chip__image" src={stat.image} alt="" />}
                  </Grid>
                </Grid>
              </div>
            ))}
          </div>
        </motion.div>

        {/* <motion.div
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
              <button
                type="button"
                className="hero-showcase__arrow"
                onClick={showPreviousHeroSlide}
                aria-label="Previous featured product"
              >
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
              <button
                type="button"
                className="hero-showcase__arrow"
                onClick={showNextHeroSlide}
                aria-label="Next featured product"
              >
                <ArrowForwardRoundedIcon />
              </button>
            </div>
          )}
          <div className="hero-showcase__foot">
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
          </div>
        </motion.div> */}
      </section>

      <SectionReveal>
        <section aria-label="Why Crunchmates">
          <div className="section-intro">
            <p className="section-kicker">Why Crunchmates</p>
            <h2>Made for the way you snack</h2>
          </div>
          <div className="feature-strip">
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
                    {block.image && <img className="feature-card__image" src={block.image} alt="" />}
                  </Grid>
                </Grid>
              </motion.article>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="spice-meter" id="flavours">
          <div className="section-intro">
            <p className="section-kicker">Spice Meter</p>
            <h2>{content.spiceMeterTitle}</h2>
            <p>{content.spiceMeterText}</p>
          </div>
          <div className="spice-meter__scale">
            <Typography variant="body2">{content.spiceMeterStartLabel}</Typography>
            <LinearProgress
              variant="determinate"
              value={content.spiceMeterValue}
              sx={{
                height: 10,
                borderRadius: 99,
                backgroundColor: "rgba(20,17,15,0.1)",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, var(--yellow) 0%, var(--accent) 100%)",
                },
              }}
            />
            <Typography variant="body2">{content.spiceMeterEndLabel}</Typography>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section aria-label="Product showcase">
          <div className="section-intro">
            <p className="section-kicker">Find your faves</p>
            <h2>Current launch and next flavor drops</h2>
          </div>
        </section>
      </SectionReveal>

      <section>
        <FlavorCarousel products={featuredProducts} />
        <div className="section-actions">
          <Button
            component={Link}
            to="/shop"
            className="secondary-button"
            variant="outlined"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Browse all flavors
          </Button>
        </div>
      </section>

      <SectionReveal>
        <section className="snack-moments">
          <div className="section-intro">
            <p className="section-kicker">Snack Moments</p>
            <h2>{content.snackMomentsTitle}</h2>
          </div>
          <div className="snack-moments__grid">
            {content.snackMoments.map((moment, index) => (
              <article key={`${moment}-${index}`} className="feature-card compact">
                <CelebrationRoundedIcon sx={{ color: "var(--yellow)" }} />
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
              <RestaurantRoundedIcon sx={{ fontSize: 16 }} /> Built for modern snack lovers
            </span>
            <span>
              <GroupsRoundedIcon sx={{ fontSize: 16 }} /> Shareable flavor energy
            </span>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="social-proof">
          <div className="section-intro">
            <p className="section-kicker">Social Buzz</p>
            <h2>{content.socialProofTitle}</h2>
          </div>
          <div className="social-proof__grid">
            {content.socialProofQuotes.map((quote, index) => (
              <blockquote key={`${quote}-${index}`} className="feature-card compact">
                {quote}
              </blockquote>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="final-cta cta-band">
          <h2 style={{fontSize:"4rem"}}>{content.finalCtaTitle}</h2>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} className="hero-actions" sx={{ justifyContent: "center", m: 0 }}>
            <Button
              component={Link}
              to="/shop"
              className="secondary-button"
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              {content.finalCtaPrimary}
            </Button>
            {comingSoon.length > 0 && (
              <Button component={Link} to="/shop" className="secondary-button" variant="outlined">
                {content.finalCtaSecondary}
              </Button>
            )}
          </Stack>
        </section>
      </SectionReveal>
    </div>
  );
}
