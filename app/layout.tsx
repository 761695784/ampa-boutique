import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google'
import { StoreProvider } from '@/components/ampa/store-context'
import { getProducts } from '@/lib/products'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "AMPA — Maison Sartoriale & Costumes Super 200's à Dakar",
    template: '%s | AMPA Dakar',
  },
  description:
    "Costumes croisés « Le Diplomate », ensembles 2 & 3 pièces Super 200's, smokings de gala et vestiaire Safari à Dakar. Cabine d'essayage virtuel, assistant morphologique et retouche en 30 min.",
  openGraph: {
    title: 'AMPA — Maison Sartoriale à Dakar',
    description:
      "L'excellence du costume pour homme à Dakar : Super 200's, essayage virtuel et retouche maître tailleur en 30 min.",
    locale: 'fr_SN',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0e291e',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const products = await getProducts()
  return (
    <html lang="fr" className={`${jakarta.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <StoreProvider initialProducts={products}>{children}</StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
