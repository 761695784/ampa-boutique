'use client'

import React, { useState } from 'react'
import {
  Search,
  CheckCircle2,
  Truck,
  Scissors,
  Gift,
  Briefcase,
  MapPin,
  Clock,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { formatPrice, getWhatsAppUrl } from '@/lib/products'
import { useStore } from './store-context'
import { BrandLogo } from './brand-logo'
import { WhatsAppIcon } from './site-shell'

type GiftCardTier = {
  amount: number
  title: string
  shortLabel: string
  badge?: string
  summary: string
  bonus: string
}

const GIFT_CARD_TIERS: GiftCardTier[] = [
  {
    amount: 35000,
    title: 'Écrin Sartorial',
    shortLabel: 'Coffret Chemise & Soie',
    summary: 'Couvre 1 Coffret Prestige (Chemise Coton Égyptien + Cravate Soie + Pochette + Boutons).',
    bonus: 'Écrin cadeau rigide & carte calligraphiée offerts',
  },
  {
    amount: 50000,
    title: 'Privilège Élégance',
    shortLabel: 'Participation Libre',
    summary: 'Participation libre à l’achat d’un costume ou sélection d’accessoires au showroom.',
    bonus: 'Livraison Express 24h Dakar offerte',
  },
  {
    amount: 80000,
    title: 'Édition Présidentielle',
    shortLabel: 'Costume 2 Pièces',
    badge: 'POPULAIRE',
    summary: 'Couvre 100 % d’un Costume 2 Pièces Super 200’s ou d’un Costume Safari Sahélien.',
    bonus: 'Retouche ourlet 30 min + Housse AMPA offertes',
  },
  {
    amount: 95000,
    title: 'Édition Le Diplomate',
    shortLabel: 'Costume Croisé 2×1',
    badge: 'BEST-SELLER',
    summary: 'Couvre 100 % du Costume Croisé « Le Diplomate » 100 % Laine Super 200’s.',
    bonus: 'Retouche ourlet + Pochette soie + Livraison VIP 24h offertes',
  },
  {
    amount: 125000,
    title: 'Édition Gala & Souverain',
    shortLabel: 'Smoking ou 3 Pièces',
    badge: 'VIP',
    summary: 'Couvre 100 % d’un Smoking de Gala revers satin ou d’un Costume 3 Pièces VIP.',
    bonus: 'Nœud papillon soie + Essayage privé & Retouches offerts',
  },
  {
    amount: 150000,
    title: 'Carte Noire Impériale',
    shortLabel: 'Vestiaire Complet',
    badge: 'PRESTIGE',
    summary: 'Tenue intégrale : Costume Croisé ou 3 Pièces + Chemise + Cravate + Boutons.',
    bonus: '+15 000 FCFA de bonus accessoires offerts par la Maison',
  },
]

export function ContactExperience() {
  const { orders, addToCart } = useStore()

  // Order tracking state
  const [trackInput, setTrackInput] = useState('')
  const [trackedRef, setTrackedRef] = useState<string | null>(null)

  // Corporate / Wedding Quote calculator
  const [groupType, setGroupType] = useState<'Corporate Dress Plan' | 'Cortège Mariage & Témoins'>(
    'Corporate Dress Plan'
  )
  const [groupCount, setGroupCount] = useState(5)
  const [groupCollection, setGroupCollection] = useState('Costumes Croisés « Le Diplomate » (95 000 FCFA)')
  const [orgName, setOrgName] = useState('')

  // Gift card builder
  const [gcAmount, setGcAmount] = useState(95000)
  const [gcRecipient, setGcRecipient] = useState('')
  const [gcSender, setGcSender] = useState('')
  const [gcMessage, setGcMessage] = useState(
    'Pour célébrer votre réussite avec toute l’élégance de la Maison AMPA Dakar.'
  )

  const activeTier =
    GIFT_CARD_TIERS.find((t) => t.amount === gcAmount) ?? GIFT_CARD_TIERS[3]

  const matchedOrder =
    orders.find((o) => o.orderNumber.toLowerCase() === (trackedRef || '').toLowerCase()) ||
    (orders.length > 0 && !trackedRef ? orders[0] : null)

  const discountRate = groupCount >= 10 ? 0.2 : groupCount >= 6 ? 0.15 : groupCount >= 3 ? 0.1 : 0
  const baseUnit = groupCollection.includes('125 000')
    ? 125000
    : groupCollection.includes('95 000')
      ? 95000
      : 80000
  const estimatedGroupTotal = Math.round(groupCount * baseUnit * (1 - discountRate))

  const handleAddGiftCardToCart = () => {
    addToCart({
      slug: 'coffret-accessoires-souverain-chemise-cravate',
      name: `Carte Cadeau « ${activeTier.title} » — ${formatPrice(gcAmount)}`,
      reference: `GC-${gcAmount / 1000}K`,
      image: '/ampa-accessories.png',
      colorName: `Pour : ${gcRecipient || 'Invité Prestige'}`,
      colorHex: '#d4af37',
      size: 'Valable 12 mois',
      formulaLabel: `De : ${gcSender || 'Vous'} · ${activeTier.bonus}`,
      unitPrice: gcAmount,
      hemRequested: true,
      hemLengthCm: 'Ourlet offert au bénéficiaire',
      quantity: 1,
    })
  }

  const waGiftCardText = [
    `Bonjour *AMPA Boutique Dakar*,`,
    `Je souhaite commander une *Carte Cadeau AMPA* :`,
    `• Carte : *${activeTier.title}* (*${formatPrice(gcAmount)}*)`,
    `• Avantage : ${activeTier.bonus}`,
    `• Bénéficiaire : *${gcRecipient || 'À préciser'}*`,
    `• De la part de : *${gcSender || 'À préciser'}*`,
    `• Message : « ${gcMessage} »`,
  ].join('\n')

  return (
    <div className="contact-experience-wrap">
      {/* 1. Clean, Visual Digital Gift Card Studio */}
      <section id="cartes-cadeaux" className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="eyebrow">CADEAU INSTANTANÉ · BOUTIQUE &amp; SHOWROOM DAKAR</p>
            <h2>Carte Cadeau Digitale AMPA</h2>
          </div>
          <div className="gc-compact-perks">
            <span>✓ Choix libre taille &amp; couleur</span>
            <span>✓ Retouche ourlet 30 min offerte</span>
            <span>✓ Valable 12 mois</span>
          </div>
        </div>

        <div className="giftcard-studio-grid">
          {/* Left: Luxury Card Visual + 1 Compact Dynamic Value Strip */}
          <div className="giftcard-left-col">
            <div className="giftcard-visual-preview">
              <div className="gc-card-inner">
                <div className="gc-top">
                  <div className="gc-logo-wrap">
                    <BrandLogo variant="footer" href="" />
                  </div>
                  <div className="gc-amount-col">
                    <span className="gc-tier-pill">{activeTier.title.toUpperCase()}</span>
                    <strong className="gc-amount">{formatPrice(gcAmount)}</strong>
                  </div>
                </div>

                <p className="gc-quote">« {gcMessage} »</p>

                <div className="gc-bottom">
                  <div>
                    <small>OFFERT À</small>
                    <strong>{gcRecipient || 'M. Abdoulaye Sy'}</strong>
                  </div>
                  <div>
                    <small>DE LA PART DE</small>
                    <strong>{gcSender || 'Votre nom'}</strong>
                  </div>
                  <div className="gc-serial">
                    <small>PRIVILÈGE</small>
                    <strong>AMPA-{gcAmount / 1000}K</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="gc-clean-summary">
              <div className="gc-clean-summary-top">
                <strong>
                  {activeTier.title} ({formatPrice(gcAmount)})
                </strong>
                <span className="gc-clean-bonus">
                  <Sparkles size={13} /> {activeTier.bonus}
                </span>
              </div>
              <p>{activeTier.summary}</p>
            </div>
          </div>

          {/* Right: Clean 6-Button Price Grid & Short Inputs */}
          <div className="giftcard-form-controls">
            <div className="sa-field">
              <label className="sa-label">Choisissez le palier de la carte</label>
              <div className="gc-tiers-compact-grid">
                {GIFT_CARD_TIERS.map((tier) => {
                  const isSelected = gcAmount === tier.amount
                  return (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => setGcAmount(tier.amount)}
                      className={`gc-tier-compact-btn ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="gc-tier-compact-head">
                        <strong>{formatPrice(tier.amount)}</strong>
                        {tier.badge && <em>{tier.badge}</em>}
                      </div>
                      <span>{tier.shortLabel}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="cart-customer-row">
              <input
                type="text"
                placeholder="Pour (Nom du bénéficiaire)"
                value={gcRecipient}
                onChange={(e) => setGcRecipient(e.target.value)}
              />
              <input
                type="text"
                placeholder="De la part de..."
                value={gcSender}
                onChange={(e) => setGcSender(e.target.value)}
              />
            </div>

            <input
              type="text"
              className="cx-text-input"
              value={gcMessage}
              onChange={(e) => setGcMessage(e.target.value)}
              placeholder="Message court sur la carte..."
            />

            <div className="gc-cta-row">
              <button type="button" className="cart-submit-btn" onClick={handleAddGiftCardToCart}>
                <ShoppingBag size={17} />
                <span>Ajouter au panier ({formatPrice(gcAmount)})</span>
              </button>

              <a
                href={getWhatsAppUrl(waGiftCardText)}
                target="_blank"
                rel="noreferrer"
                className="gc-wa-icon-btn"
                title="Commander cette carte sur WhatsApp"
                aria-label="Commander cette carte sur WhatsApp"
              >
                <WhatsAppIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Order Tracking Section */}
      <section id="suivi" className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="eyebrow">SUIVI EN TEMPS RÉEL · DAKAR &amp; SÉNÉGAL</p>
            <h2>Suivre ma commande &amp; ma retouche</h2>
          </div>
          <span className="cx-badge">
            <Truck size={14} /> Livraison Express 24h
          </span>
        </div>

        <div className="tracking-card">
          <form
            className="tracking-search-bar"
            onSubmit={(e) => {
              e.preventDefault()
              setTrackedRef(trackInput.trim() || 'AMP-2026-8419')
            }}
          >
            <Search size={18} />
            <input
              type="text"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder="Numéro de commande (ex: AMP-2026-8419)..."
            />
            <button type="submit">Suivre</button>
          </form>

          {matchedOrder || trackedRef ? (
            <div className="tracking-result">
              <div className="tracking-result-top">
                <div>
                  <small>RÉFÉRENCE COMMANDE</small>
                  <h3>{matchedOrder?.orderNumber || trackedRef?.toUpperCase()}</h3>
                </div>
                <div className="tracking-meta-right">
                  <span className="tracking-status-pill">
                    <CheckCircle2 size={14} /> En préparation atelier &amp; contrôle tailleur
                  </span>
                </div>
              </div>

              <div className="tracking-steps-grid">
                <div className="t-step done">
                  <span className="t-dot">1</span>
                  <strong>Validée</strong>
                  <p>Pièce réservée à Dakar.</p>
                </div>
                <div className="t-step active">
                  <span className="t-dot">2</span>
                  <strong>Ourlet 30 min</strong>
                  <p>Ajustement maître tailleur.</p>
                </div>
                <div className="t-step">
                  <span className="t-dot">3</span>
                  <strong>Coursier 24h</strong>
                  <p>En route vers vous.</p>
                </div>
                <div className="t-step">
                  <span className="t-dot">4</span>
                  <strong>Livrée</strong>
                  <p>Sous housse AMPA.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="tracking-demo-hint">
              <button
                type="button"
                onClick={() => {
                  setTrackInput('AMP-2026-8419')
                  setTrackedRef('AMP-2026-8419')
                }}
              >
                Tester avec la commande démo AMP-2026-8419 →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Corporate Dress Plan & Wedding Cortège Calculator */}
      <section id="corporate" className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="eyebrow">CORPORATE DRESS PLAN &amp; CORTÈGES MARIAGE</p>
            <h2>Entreprises &amp; Groupes Cérémonie</h2>
          </div>
          <span className="cx-badge">
            <Briefcase size={14} /> Jusqu&apos;à -20% dès 10 tenues
          </span>
        </div>

        <div className="corporate-grid">
          <div className="corporate-controls">
            <div className="sa-field">
              <label className="sa-label">Formule de groupe</label>
              <div className="sa-pills">
                {(['Corporate Dress Plan', 'Cortège Mariage & Témoins'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setGroupType(t)}
                    className={`sa-pill ${groupType === t ? 'selected' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="sa-field">
              <label className="sa-label">Collection</label>
              <select
                value={groupCollection}
                onChange={(e) => setGroupCollection(e.target.value)}
                className="cart-select"
              >
                <option>Costumes 2 Pièces « Le Présidentiel » (80 000 FCFA)</option>
                <option>Costumes Croisés « Le Diplomate » (95 000 FCFA)</option>
                <option>Smokings de Gala « Le Souverain » (125 000 FCFA)</option>
              </select>
            </div>

            <div className="sa-slider-box">
              <div className="sa-slider-head">
                <span>Nombre de tenues</span>
                <strong>{groupCount} tenues</strong>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={groupCount}
                onChange={(e) => setGroupCount(Number(e.target.value))}
                className="sa-range"
              />
            </div>

            <input
              type="text"
              className="cx-text-input"
              placeholder="Nom de l'entreprise ou du futur marié"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div className="corporate-summary-card">
            <div>
              <span className="eyebrow">{groupType.toUpperCase()}</span>
              <h3>Devis Groupe Privilège</h3>
            </div>
            <div className="corp-price-row">
              <span>Tarif (-{Math.round(discountRate * 100)}%)</span>
              <strong>{formatPrice(estimatedGroupTotal)}</strong>
            </div>
            <ul className="corp-perks">
              <li>
                <Scissors size={14} /> Prise de mesures sur site à Dakar &amp; ourlets inclus
              </li>
              <li>
                <CheckCircle2 size={14} /> Housses griffées &amp; livraison groupée
              </li>
            </ul>
            <a
              href={getWhatsAppUrl(
                `Bonjour AMPA Boutique Dakar,\nJe souhaite un devis *${groupType}* :\n• Organisation : ${orgName || 'À préciser'}\n• Gamme : ${groupCollection}\n• Quantité : ${groupCount} tenues (${formatPrice(estimatedGroupTotal)})`
              )}
              target="_blank"
              rel="noreferrer"
              className="cart-wa-btn"
            >
              <WhatsAppIcon size={17} />
              <span>Demander ce devis sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Showroom & Direct Contact Cards */}
      <section className="contact-grid">
        <article className="contact-card">
          <div className="contact-card-icon">
            <MapPin size={22} />
          </div>
          <h2>Showroom &amp; Atelier Dakar</h2>
          <p>
            Essayez nos coupes croisées « Le Diplomate » et nos smokings à Dakar. Retouche ourlet en <strong>30 minutes</strong> sur place.
          </p>
          <p className="contact-hours">
            <Clock size={14} /> Lundi – Samedi : 09h30 à 20h30
          </p>
        </article>

        <article className="contact-card">
          <div className="contact-card-icon">
            <WhatsAppIcon size={22} />
          </div>
          <h2>Conseiller Sartorial Direct</h2>
          <p>
            Besoin d&apos;une confirmation de taille ou d&apos;une livraison express en moins de 3 heures dans Dakar ? Écrivez-nous directement.
          </p>
          <a
            href={getWhatsAppUrl(
              'Bonjour AMPA Boutique Dakar, je souhaite prendre rendez-vous ou être conseillé sur une tenue.'
            )}
            target="_blank"
            rel="noreferrer"
          >
            Discuter sur WhatsApp ↗
          </a>
        </article>
      </section>
    </div>
  )
}
