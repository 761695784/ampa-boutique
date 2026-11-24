import type { Metadata } from 'next'
import Link from 'next/link'
import { Shell } from '@/components/ampa/site-shell'
import { SizeAssistant } from '@/components/ampa/size-assistant'

export const metadata: Metadata = {
  title: 'Assistant de Taille Morphologique & Guide des Mesures',
  description:
    'Trouvez votre taille idéale de costume (44 à 60) en 30 secondes grâce à l’Assistant de Taille Morphologique AMPA Boutique Dakar.',
}

const steps = [
  {
    n: '01',
    title: 'Tour de poitrine',
    text: 'Passez le mètre ruban sous les bras et autour de la partie la plus large de votre poitrine. Gardez le ruban horizontal, en respirant normalement. Divisez par 2 pour obtenir votre repère de taille européenne (ex: 100 cm → Taille 50).',
  },
  {
    n: '02',
    title: 'Tour de taille & Pattes de serrage',
    text: 'Mesurez autour de votre taille naturelle. Nos pantalons Super 200’s sont équipés de pattes de serrage latérales réglables permettant d’ajuster la ceinture de +/– 4 cm sans retouche complexe.',
  },
  {
    n: '03',
    title: 'Carrure d’épaules',
    text: 'Mesurez d’une extrémité d’épaule à l’autre dans le dos. Si vous avez des épaules athlétiques ou larges, notre assistant morphologique le prend en compte pour nos coupes croisées « Le Diplomate ».',
  },
  {
    n: '04',
    title: 'Longueur de jambe & Ourlet Express 30 min',
    text: 'Tous nos pantalons sont livrés sans ourlet avec une généreuse réserve de tissu. Notre maître tailleur partenaire près de la boutique réalise votre ourlet exact en 30 minutes avant livraison à Dakar.',
  },
]

export default async function SizeGuide({
  searchParams,
}: {
  searchParams: Promise<{ retour?: string }>
}) {
  const { retour } = await searchParams

  return (
    <Shell>
      <main className="info-page info-page-wide">
        <header className="info-hero">
          <div className="info-hero-top">
            <p className="eyebrow">TECHNOLOGIE SARTORIALE AMPA · DAKAR</p>
            {retour && (
              <Link href={retour} className="back-to-product-pill">
                ← Retourner à ma pièce sélectionnée
              </Link>
            )}
          </div>
          <h1>Assistant de Taille &amp; Morphologie</h1>
          <p>
            Calculez votre taille idéale (de 44 à 60) en 30 secondes selon votre stature, votre poids, votre taille de chemise et votre silhouette — ou renseignez vos mesures tailleur en centimètres.
          </p>
        </header>

        <section className="size-assistant-section">
          <SizeAssistant />
        </section>

        <section className="measure-steps-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SAVOIR-FAIRE TAILLEUR</p>
              <h2>Comment prendre vos mesures chez vous</h2>
            </div>
          </div>

          <div className="measure-grid">
            {steps.map((s) => (
              <article className="measure-card" key={s.n}>
                <span>{s.n}</span>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <p className="guide-note">
          Votre taille recommandée est automatiquement mémorisée sur votre appareil afin de pré-sélectionner la coupe idéale sur chaque fiche produit. Pour retourner à votre sélection :{' '}
          <Link href={retour || '/collections/costumes'}>
            <u>retourner au catalogue</u>
          </Link>
          .
        </p>
      </main>
    </Shell>
  )
}
