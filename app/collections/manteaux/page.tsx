import type { Metadata } from 'next'
import Link from 'next/link'
import { Shell } from '@/components/ampa/site-shell'
import { CollectionGrid } from '@/components/ampa/collection-grid'
import { getCollection } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Costumes Safari Sahéliens, Manteaux & Coffrets Accessoires à Dakar',
  description:
    "Découvrez les costumes Safari modernes en Super 200's infroissable, les manteaux longs en laine & cachemire et les coffrets chemises & cravates chez AMPA Boutique à Dakar.",
}

export default async function ManteauxPage({
  searchParams,
}: {
  searchParams: Promise<{ couleur?: string; taille?: string; coupe?: string }>
}) {
  const [products, filters] = await Promise.all([getCollection('manteaux'), searchParams])

  return (
    <Shell>
      <main className="category-page">
        <div className="breadcrumbs">
          <Link href="/">Accueil</Link>
          <span>/</span>
          <span>Safari, Manteaux &amp; Accessoires</span>
        </div>

        <header className="category-title">
          <div>
            <p className="eyebrow">ALLURE CONTEMPORAINE · DAKAR &amp; INTERNATIONAL</p>
            <h1>Safari, Manteaux &amp; Accessoires</h1>
          </div>
          <p>
            Ensembles Safari sahéliens en Super 200&apos;s respirant, manteaux longs en drap de cachemire pour vos déplacements et coffrets chemises &amp; cravates en soie tricotée main.
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
