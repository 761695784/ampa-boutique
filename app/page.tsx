import type { Metadata } from 'next'
import { Shell } from '@/components/ampa/site-shell'
import { HomeShowcase } from '@/components/ampa/home-showcase'
import { getProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: "AMPA Boutique Dakar — Costumes Croisés « Le Diplomate », Super 200's, Smokings & Safari",
  description:
    "Votre référence du costume de luxe, prêt-à-porter et accessoires pour homme à Dakar : costumes croisés, 2 & 3 pièces VIP, smokings, safari et manteaux. Assistant de taille interactif et livraison 24h.",
}

export default async function Home() {
  const products = await getProducts()
  return (
    <Shell>
      <HomeShowcase products={products} />
    </Shell>
  )
}
