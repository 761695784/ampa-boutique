import type { Metadata } from 'next'
import { Shell } from '@/components/ampa/site-shell'
import { ContactExperience } from '@/components/ampa/contact-experience'

export const metadata: Metadata = {
  title: 'Showroom Dakar, Suivi de Commande, Corporate Dress Plan & Cartes Cadeaux',
  description:
    'Suivez votre commande AMPA Boutique à Dakar, demandez un devis Corporate Dress Plan ou Cortège Mariage, créez une Carte Cadeau digitale ou contactez notre showroom.',
}

export default function ContactPage() {
  return (
    <Shell>
      <main className="info-page info-page-wide">
        <header className="info-hero">
          <p className="eyebrow">MAISON AMPA BOUTIQUE · DAKAR, SÉNÉGAL</p>
          <h1>Conciergerie, Suivi &amp; Sur-Mesure.</h1>
          <p>
            Suivez l&apos;avancement de votre commande et de votre retouche en temps réel, configurez une offre Corporate Dress Plan ou Cortège Mariage, ou offrez une Carte Cadeau digitale.
          </p>
        </header>

        <ContactExperience />
      </main>
    </Shell>
  )
}
