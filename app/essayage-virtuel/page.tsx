import type { Metadata } from 'next'
import Link from 'next/link'
import { Shell } from '@/components/ampa/site-shell'
import { VirtualTryOn } from '@/components/ampa/virtual-tryon'
import { getProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Atelier Colorimétrie & Essayage Virtuel IA — AMPA Boutique Dakar',
  description:
    'Testez l’accord exact de nos draps de laine Super 200’s avec votre carnation grâce au Miroir Drapé instantané ou générez un essayage IA photoréaliste chez AMPA Boutique Dakar.',
}

export default async function VirtualTryOnPage({
  searchParams,
}: {
  searchParams: Promise<{ modele?: string }>
}) {
  const [products, params] = await Promise.all([getProducts(), searchParams])

  return (
    <Shell>
      <main className="info-page info-page-wide">
        <div className="breadcrumbs">
          <Link href="/">Accueil</Link>
          <span>/</span>
          <span>Atelier Essayage &amp; Colorimétrie</span>
        </div>

        <header className="info-hero">
          <p className="eyebrow">ATELIER DIGITAL &amp; IA · MAISON AMPA DAKAR</p>
          <h1>Atelier d&apos;Essayage &amp; Accord Teint.</h1>
          <p>
            Importez votre portrait pour diagnostiquer instantanément votre sous-ton, visualiser le drapé du tissu sous votre visage sans déformation, ou générer un essayage IA photoréaliste sur votre propre silhouette.
          </p>
        </header>

        <section className="vto-page-section">
          <VirtualTryOn products={products} initialSlug={params.modele} />
        </section>
      </main>
    </Shell>
  )
}
