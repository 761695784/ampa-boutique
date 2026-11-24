import type { Metadata } from 'next'
import Link from 'next/link'
import { Shell } from '@/components/ampa/site-shell'
import { CollectionGrid } from '@/components/ampa/collection-grid'
import { getCollection } from '@/lib/products'

export const metadata: Metadata = {
  title: "Costumes Croisés, 2 & 3 Pièces Super 200's & Smokings à Dakar",
  description:
    "Explorez la collection de costumes croisés « Le Diplomate », ensembles 2 et 3 pièces VIP en laine Super 200's et smokings de cérémonie chez AMPA Boutique à Dakar.",
}

export default async function CostumesPage({
  searchParams,
}: {
  searchParams: Promise<{ couleur?: string; taille?: string; coupe?: string }>
}) {
  const [products, filters] = await Promise.all([getCollection('costumes'), searchParams])

  return (
    <Shell>
      <main className="category-page">
        <div className="breadcrumbs">
          <Link href="/">Accueil</Link>
          <span>/</span>
          <span>Costumes &amp; Smokings</span>
        </div>

        <header className="category-title">
          <div>
            <p className="eyebrow">LE VESTIAIRE SARTORIAL · SUPER 200&apos;S</p>
            <h1>Costumes &amp; Cérémonie</h1>
          </div>
          <p>
            Du célèbre costume croisé 2×1 « Le Diplomate » aux ensembles 2 &amp; 3 pièces VIP et smokings de gala. Livrés avec réserve d&apos;ourlet et retouche express en 30 min à Dakar.
          </p>
        </header>

        <CollectionGrid
          products={products}
          initialColor={filters.couleur}
          initialSize={filters.taille}
          initialCut={filters.coupe}
        />
      </main>
    </Shell>
  )
}
