import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { SITE_URL } from "@/lib/site";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Louvat Box — Abonnement Biscuits Artisanaux",
    template: "%s",
  },
  description: "Chaque mois, la Biscuiterie Louvat sélectionne 3 produits artisanaux (500g). Pour les entreprises et via les comités d'entreprise, par prélèvement SEPA.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Louvat Box",
    title: "Louvat Box — Abonnement Biscuits Artisanaux",
    description: "Chaque mois, la Biscuiterie Louvat sélectionne 3 produits artisanaux (500g). Pour les entreprises et via les comités d'entreprise, par prélèvement SEPA.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Biscuiterie Louvat",
  foundingDate: "1954",
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "ZA Le Bigallet, 452 route de Chartreuse",
    postalCode: "38620",
    addressLocality: "Saint-Geoire-en-Valdaine",
    addressCountry: "FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
