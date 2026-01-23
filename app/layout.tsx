import type { Metadata } from "next";
import "./globals.css";

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

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
