'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import {
  Sparkles,
  ArrowUpRight,
  Truck,
  Scissors,
  Award,
  ChevronDown,
  Briefcase,
  Gift,
  Star,
  Camera,
} from 'lucide-react'
import type { Product } from '@/lib/products'
import { formatPrice } from '@/lib/products'
import { ProductCard } from './product-card'
import { useStore } from './store-context'

const HERO_LOOKS = [
  {
    id: '01',
    tag: "COLLECTION SIGNATURE · SUPER 200'S",
    title: 'Le Diplomate.\nL’autorité du croisé.',
    subtitle:
      'Confectionné en laine vierge Super 200’s, larges revers en pointe surpiqués et pantalon à pattes de serrage latérales.',
    image: '/ampa-hero.png',
    price: 95000,
    href: '/produit/costume-croise-le-diplomate-olive',
    stamp: 'COUPE CROISÉE 2×1 · SUPER 200’S',
  },
  {
    id: '02',
    tag: 'MARIAGES, GALAS & GRANDES SOIRÉES',
    title: 'Le Souverain.\nL’éclat du smoking.',
    subtitle:
      'Revers châle en satin de soie véritable, laine turque haute densité et tombé magnétique pour vos cérémonies à Dakar.',
    image: '/ampa-smoking.png',
    price: 125000,
    href: '/produit/smoking-gala-imperial-noir',
    stamp: 'REVERS CHÂLE SATIN · ÉDITION GALA',
  },
  {
    id: '03',
    tag: 'ÉLÉGANCE SAHÉLIENNE & AFRO-CHIC',
    title: 'Le Sahélien.\nL’allure Safari.',
    subtitle:
      'Veste à col chemise 4 poches structurées en Super 200’s infroissable et respirant, pensée pour le climat de Dakar.',
    image: '/ampa-safari.png',
    price: 85000,
    href: '/produit/costume-safari-sahelien-sable',
    stamp: 'SAFARI SUPER 200’S · INFROISSABLE',
  },
]

const CATALOG_TABS = [
  { id: 'all', label: 'Tout' },
  { id: 'croises', label: 'Croisés' },
  { id: 'deux-trois-pieces', label: '2 & 3 Pièces' },
  { id: 'smokings-gala', label: 'Smokings' },
  { id: 'safari-sahelien', label: 'Safari' },
  { id: 'manteaux-accessoires', label: 'Manteaux & Coffrets' },
]

const FAQ_ITEMS = [
  {
    q: 'Comment être certain de choisir la bonne taille sans essayer en boutique ?',
    a: 'Notre Assistant de Taille Morphologique calcule votre taille européenne exacte (de 44 à 60) en croisant votre taille en cm, votre poids et votre morphologie avec 95 % de précision. De plus, nos pantalons disposent de pattes de serrage latérales permettant d’ajuster la ceinture de +/– 4 cm.',
  },
  {
    q: 'Pourquoi vos pantalons sont-ils livrés sans ourlet ?',
    a: 'Nos pantalons Super 200’s sont confectionnés avec une réserve de longueur non ourlée afin de s’adapter au millimètre près à votre stature. Notre maître tailleur partenaire près du showroom à Dakar réalise votre ourlet en 30 minutes avant la livraison.',
  },
  {
    q: 'Quels sont les délais et modes de livraison à Dakar et au Sénégal ?',
    a: 'Nous assurons une Livraison Express en 24h (souvent en 3h à 12h selon le quartier à Dakar). Nous expédions également dans toutes les régions du Sénégal (24h–48h) et à l’international via DHL.',
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'Vous pouvez régler votre commande via Wave, Orange Money, en espèces directement à la livraison à Dakar, ou lors de votre passage au showroom.',
  },
]

export function HomeShowcase({ products }: { products: Product[] }) {
  const { allProducts } = useStore()
  const liveProducts = allProducts.length > 0 ? allProducts : products
  const [heroIdx, setHeroIdx] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const activeLook = HERO_LOOKS[heroIdx]

  const filteredProducts = liveProducts.filter((p) => {
    if (activeTab === 'all') return true
    if (activeTab === 'manteaux-accessoires') {
      return p.collectionTag === 'manteaux-blazers' || p.collectionTag === 'chemises-accessoires'
    }
    return p.collectionTag === activeTab
  })

  return (
    <main>
      {/* 1. Hero Editorial Split with Interactive Look Switcher */}
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">{activeLook.tag}</p>
          <h1 style={{ whiteSpace: 'pre-line' }}>{activeLook.title}</h1>
          <p>{activeLook.subtitle}</p>

          <div className="hero-price-pill">
            <span>Dès</span>
            <strong>{formatPrice(activeLook.price)}</strong>
            <small>· Livraison 24h Dakar</small>
          </div>

          <div className="hero-cta-row">
            <Link className="hero-primary-btn" href={activeLook.href}>
              <span>Découvrir</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link className="hero-secondary-btn" href="/essayage-virtuel">
              <Camera size={15} />
              <span>Essayer</span>
            </Link>
          </div>

          <div className="hero-look-switcher" role="tablist" aria-label="Choisir la silhouette à la une">
            {HERO_LOOKS.map((look, i) => (
              <button
                key={look.id}
                type="button"
                onClick={() => setHeroIdx(i)}
                className={`hero-look-dot ${heroIdx === i ? 'active' : ''}`}
              >
                <span>{look.id}</span>
                <small>{look.title.split('.')[0]}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="hero-image">
          <Image
            key={activeLook.image}
            src={activeLook.image}
            alt={activeLook.title}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 55vw"
          />
          <span className="hero-stamp">{activeLook.stamp}</span>
        </div>
      </section>

      {/* 2. Luxury Service Pillars Strip */}
      <section className="service-pillars-bar">
        <div className="pillar-card">
          <Award size={20} />
          <div>
            <strong>Laine Super 200&apos;s</strong>
            <span>Tombé impeccable &amp; respirant</span>
          </div>
        </div>
        <div className="pillar-card">
          <Camera size={20} />
          <div>
            <strong>Essayage Virtuel Photo</strong>
            <span>Testez chaque costume sur vous</span>
          </div>
        </div>
        <div className="pillar-card">
          <Scissors size={20} />
          <div>
            <strong>Ourlet Express 30 min</strong>
            <span>Ajusté par notre maître tailleur</span>
          </div>
        </div>
        <div className="pillar-card">
          <Truck size={20} />
          <div>
            <strong>Livraison 24h Dakar</strong>
            <span>Wave, Orange Money ou Livraison</span>
          </div>
        </div>
      </section>

      {/* 3. Visual Category Bento Grid */}
      <section className="section-wrap categories-bento-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LES UNIVERS DU VESTIAIRE · DAKAR</p>
            <h2>Collections</h2>
          </div>
          <Link className="text-link" href="/collections/costumes">
            Tout le catalogue ↗
          </Link>
        </div>

        <div className="bento-collections-grid">
          <Link
            className="bento-tile bento-tile-large"
            href="/collections/costumes?coupe=croises"
          >
            <Image
              src="/ampa-diplomate.png"
              alt="Costumes Croisés Le Diplomate"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <div className="bento-overlay">
              <span className="bento-tag">GAMME ICONIQUE · 95 000 FCFA</span>
              <h3>Costumes Croisés « Le Diplomate » ↗</h3>
              <p>Coupe 2×1 · Super 200&apos;s 100% Laine</p>
            </div>
          </Link>

          <Link
            className="bento-tile"
            href="/collections/costumes?coupe=deux-trois-pieces"
          >
            <Image
              src="/ampa-three-piece.png"
              alt="Costumes 2 & 3 Pièces VIP"
              fill
              sizes="(max-width: 800px) 50vw, 25vw"
            />
            <div className="bento-overlay">
              <span className="bento-tag">DÈS 78 000 FCFA</span>
              <h3>2 &amp; 3 Pièces VIP ↗</h3>
              <p>Laine froide &amp; gilets croisés</p>
            </div>
          </Link>

          <Link
            className="bento-tile"
            href="/collections/costumes?coupe=smokings-gala"
          >
            <Image
              src="/ampa-smoking.png"
              alt="Smokings & Cérémonie"
              fill
              sizes="(max-width: 800px) 50vw, 25vw"
            />
            <div className="bento-overlay">
              <span className="bento-tag">125 000 FCFA</span>
              <h3>Smokings de Gala ↗</h3>
              <p>Revers châle satin de soie</p>
            </div>
          </Link>

          <Link
            className="bento-tile"
            href="/collections/manteaux?coupe=safari-sahelien"
          >
            <Image
              src="/ampa-safari.png"
              alt="Costumes Safari Sahéliens"
              fill
              sizes="(max-width: 800px) 50vw, 25vw"
            />
            <div className="bento-overlay">
              <span className="bento-tag">85 000 FCFA</span>
              <h3>Costumes Safari ↗</h3>
              <p>Col chemise &amp; tissu infroissable</p>
            </div>
          </Link>

          <Link
            className="bento-tile"
            href="/collections/manteaux"
          >
            <Image
              src="/ampa-coat.png"
              alt="Manteaux & Coffrets Accessoires"
              fill
              sizes="(max-width: 800px) 50vw, 25vw"
            />
            <div className="bento-overlay">
              <span className="bento-tag">DÈS 35 000 FCFA</span>
              <h3>Manteaux &amp; Coffrets ↗</h3>
              <p>Cachemire, chemises &amp; cravates</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Interactive Tabbed Product Catalog on Homepage */}
      <section className="section-wrap catalog-showcase-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SÉLECTION AMPA · LIVRAISON 24H DAKAR</p>
            <h2>Pièces Signatures</h2>
          </div>
          <Link className="text-link" href="/collections/costumes">
            Tout voir ({products.length}) ↗
          </Link>
        </div>

        <div className="home-catalog-tabs" role="tablist">
          {CATALOG_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={`home-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* 5. Clean 2-Card Interactive Tools Hub (Essayage Virtuel + Assistant Taille + Corporate + Cartes Cadeaux) */}
      <section className="section-wrap corporate-gift-banner">
        <div className="cg-card cg-card-dark">
          <div className="cg-icon">
            <Camera size={22} />
          </div>
          <span className="eyebrow">CABINE D&apos;ESSAYAGE VIRTUEL</span>
          <h3>Essayer un costume sur votre photo</h3>
          <p>
            Importez votre portrait ou prenez un selfie pour visualiser nos costumes croisés « Le Diplomate », smokings et ensembles Safari directement sur vous.
          </p>
          <Link href="/essayage-virtuel" className="cg-link">
            Ouvrir la cabine d&apos;essayage ↗
          </Link>
        </div>

        <div className="cg-card">
          <div className="cg-icon">
            <Sparkles size={22} />
          </div>
          <span className="eyebrow">ASSISTANT MORPHOLOGIQUE 30S</span>
          <h3>Connaître votre taille exacte (44 à 60)</h3>
          <p>
            Renseignez votre taille, votre poids et votre silhouette : notre algorithme tailleur détermine votre coupe idéale avec 95 % de précision.
          </p>
          <Link href="/guide-des-tailles" className="cg-link">
            Calculer ma taille ↗
          </Link>
        </div>

        <div className="cg-card">
          <div className="cg-icon">
            <Briefcase size={22} />
          </div>
          <span className="eyebrow">ENTREPRISES &amp; CORTÈGES MARIAGE</span>
          <h3>Corporate Dress Plan &amp; Mariés</h3>
          <p>
            Jusqu&apos;à <strong>-20 % de remise groupe</strong> dès 3 à 10 tenues, avec prise de mesures sur site à Dakar et retouches d&apos;ourlets offertes.
          </p>
          <Link href="/contact#corporate" className="cg-link">
            Simuler un devis groupe ↗
          </Link>
        </div>

        <div className="cg-card cg-card-dark">
          <div className="cg-icon">
            <Gift size={22} />
          </div>
          <span className="eyebrow">CADEAU D&apos;EXCEPTION</span>
          <h3>Cartes Cadeaux Digitales AMPA</h3>
          <p>
            Offrez un costume croisé ou un coffret chemise &amp; soie sans risque de vous tromper de taille, avec retouche ourlet 30 min incluse.
          </p>
          <Link href="/contact#cartes-cadeaux" className="cg-link">
            Choisir une Carte Cadeau ↗
          </Link>
        </div>
      </section>

      {/* 6. Client Testimonials in Dakar */}
      <section className="section-wrap testimonials-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ILS PORTENT LA MAISON AMPA À DAKAR</p>
            <h2>Avis Clients</h2>
          </div>
        </div>

        <div className="testimonials-grid">
          <article className="testimonial-card">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p>
              « L&apos;assistant de taille m&apos;a recommandé le 52 pour le costume croisé Le Diplomate Tabac. Livré aux Almadies en moins de 6 heures avec l&apos;ourlet déjà ajusté. »
            </p>
            <footer>
              <strong>Me Cheikh A. Tidiane Sy</strong>
              <span>Avocat à la Cour · Dakar Plateau</span>
            </footer>
          </article>

          <article className="testimonial-card">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p>
              « Nous avons habillé le marié et 6 témoins avec le Smoking Le Souverain. Les pattes de serrage au pantalon et la retouche express en 30 minutes ont tout changé. »
            </p>
            <footer>
              <strong>M. Mouhamadou Lamine Ndiaye</strong>
              <span>Cortège Mariage VIP · Mermoz, Dakar</span>
            </footer>
          </article>

          <article className="testimonial-card">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p>
              « Le costume Safari Sahélien beige sable est ma tenue favorite du vendredi. Léger, respirant sous la chaleur de Dakar et d&apos;une prestance remarquable. »
            </p>
            <footer>
              <strong>M. Ibrahima Fall</strong>
              <span>Directeur Financier · Point E, Dakar</span>
            </footer>
          </article>
        </div>
      </section>

      {/* 7. Interactive FAQ Section */}
      <section className="section-wrap faq-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GUIDE D&apos;ACHAT</p>
            <h2>Questions fréquentes</h2>
          </div>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={item.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                {isOpen && <p className="faq-answer">{item.a}</p>}
              </div>
            )
          })}
        </div>
      </section>

      {/* 8. Brand Manifesto Note */}
      <section className="brand-note">
        <span className="eyebrow">LA SIGNATURE SARTORIALE DE DAKAR</span>
        <p>
          De la coupe croisée <span>« Le Diplomate »</span> aux réceptions de gala, une allure souveraine façonnée pour vous.
        </p>
      </section>
    </main>
  )
}
