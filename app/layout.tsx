import { AnimatedWrapper } from "@/components/magicui/animated-wrapper";
import Footer from "@/components/site/Footer";
import Navbar from "@/components/site/Navbar";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";

export const metadata: Metadata = {
  title: "TOKO SANJAYA LIGHTING - Luxury Decorative Lighting",
  description:
    "Premium luxury decorative lighting solutions for discerning homeowners. Transform your space with our carefully curated collection.",
  keywords:
    "luxury lighting, decorative lamps, lampu hias, chandelier, pendant lights, Jakarta",
  openGraph: {
    title: "Sanjaya Lighting - Luxury Decorative Lighting",
    description: "Premium luxury decorative lighting solutions",
    type: "website",
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AnimatedWrapper
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Navbar />
          <main>
            <Providers>{children}</Providers>
          </main>
          <Footer />
        </AnimatedWrapper>
      </body>
    </html>
  );
}
