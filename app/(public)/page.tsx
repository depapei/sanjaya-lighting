"use client";
import Hero from "@/components/site/Hero";
import ProductBento from "@/components/site/ProductBento";
import FeaturedProductCarousel, {
  ProductCarousel,
} from "@/components/site/ProductCarousel";
import AboutPage from "@/components/site/pages/About";
import ContactPage from "@/components/site/pages/Contact";
import ReviewPage from "@/components/site/pages/reviews/Reviews";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Product Section */}
      {/* All - Carousel Style */}
      <ProductCarousel title="Jelajahi Produk Kami" />

      {/* All - Bento Style */}
      <ProductBento />

      {/* Featured - Carousel Style */}
      <FeaturedProductCarousel />

      {/* Review Section */}
      <ReviewPage />

      {/* About Section */}
      <AboutPage />

      {/* Contact Section */}
      <ContactPage />
    </>
  );
}
