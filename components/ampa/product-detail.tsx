'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Scissors,
  Truck,
  ShieldCheck,
  Check,
  Heart,
  Ruler,
  Camera,
} from 'lucide-react'
import type { Product } from '@/lib/products'
import {
  defaultFormulas,
  formatPrice,
  AMPA_WHATSAPP_DISPLAY,
  getWhatsAppUrl,
} from '@/lib/products'
import { useStore } from './store-context'
import { ProductCard } from './product-card'
import { VirtualTryOn } from './virtual-tryon'

export function ProductDetail({
  product,
  from,
  relatedProducts = [],
}: {
  product: Product
  from?: string
  relatedProducts?: Product[]
}) {
  const { addToCart, sizeProfile, setSizeModalOpen, wishlist, toggleWishlist, allProducts } = useStore()

  const [colorIndex, setColorIndex] = useState(0)
  const [size, setSize] = useState('')
  const availableFormulas = product.formulas?.length ? product.formulas : defaultFormulas
  const [selectedFormulaId, setSelectedFormulaId] = useState(availableFormulas[0].id)
  const [hemRequested, setHemRequested] = useState(false)
  const [hemLengthCm, setHemLengthCm] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showInlineTryOn, setShowInlineTryOn] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!size && sizeProfile?.recommendedSize && product.sizes.includes(sizeProfile.recommendedSize)) {
      setSize(sizeProfile.recommendedSize)
    }
    if (!hemLengthCm && sizeProfile?.inseamCm) {
      setHemLengthCm(String(sizeProfile.inseamCm))
    }
  }, [sizeProfile, product.sizes, size, hemLengthCm])

  const color = product.colors[colorIndex] ?? product.colors[0]
  const image = color?.image ?? product.image
  const activeFormula =
    availableFormulas.find((f) => f.id === selectedFormulaId) ?? availableFormulas[0]

  const basePrice = product.price ?? 85000
  const hemFee = hemRequested ? 3000 : 0
  const unitTotal = basePrice + activeFormula.priceDelta + hemFee
  const isWished = wishlist.includes(product.slug)

  const message = [
    `Bonjour *AMPA Boutique Dakar* (${AMPA_WHATSAPP_DISPLAY}), je souhaite commander / vérifier la disponibilité de :`,
    `• Modèle : *${product.name}* (${product.reference})`,
    `• Coloris : ${color.name}`,
    `• Taille : *${size || (sizeProfile ? `${sizeProfile.recommendedSize} (recommandée)` : 'à préciser')}*`,
    `• Formule : ${activeFormula.label}`,
    hemRequested
      ? `• Retouche Ourlet Express : Oui (${hemLengthCm ? `${hemLengthCm} cm` : 'à ajuster par le maître tailleur'})`
      : `• Ourlet : Standard (livré avec réserve d'ourlet)`,
    `• Total estimé : *${formatPrice(unitTotal)}*`,
  ].join('\n')

  const waLink = getWhatsAppUrl(message)

  const handleAddToCart = () => {
    const finalSize =
      size ||
      (sizeProfile && product.sizes.includes(sizeProfile.recommendedSize)
        ? sizeProfile.recommendedSize
        : product.sizes[Math.floor(product.sizes.length / 2)] || '50')
    if (!size) setSize(finalSize)

    addToCart({
      slug: product.slug,
      name: product.name,
      reference: product.reference,
      image,
      colorName: color.name,
      colorHex: color.hex,
      size: finalSize,
      formulaLabel: activeFormula.label,
      unitPrice: unitTotal,
      hemRequested,
      hemLengthCm: hemRequested ? hemLengthCm : undefined,
      quantity: 1,
    })
  }

  return (
    <main className="product-page">
      <div className="breadcrumbs">
        <Link href="/">Accueil</Link>
        <span>/</span>
        <Link href={from || `/collections/${product.category}`}>
          {product.collectionLabel || (product.category === 'costumes' ? 'Costumes' : 'Manteaux')}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-layout">
        {/* Left: Product Gallery */}
        <div className="product-gallery">
          <div className="detail-image">
            <Image
              key={image}
              src={image}
              alt={`${product.name} — ${color.name}`}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
            />
            <div className="detail-badges-overlay">
              {product.badge && <span className="detail-badge-primary">{product.badge}</span>}
              {product.fabric && <span className="detail-badge-fabric">{product.fabric}</span>}
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              className={`detail-wishlist-btn ${isWished ? 'active' : ''}`}
              aria-label="Ajouter aux favoris"
            >
              <Heart size={18} fill={isWished ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="detail-thumbs-row">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColorIndex(idx)}
                className={`detail-thumb-card ${colorIndex === idx ? 'active' : ''}`}
              >
                <div className="detail-thumb-img">
                  <Image src={c.image || product.image} alt={c.name} fill sizes="100px" />
                </div>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <p className="gallery-caption">
            <span>MAISON AMPA DAKAR · RÉF. {product.reference}</span>
            <span>COLORIS : {color.name.toUpperCase()}</span>
          </p>

          {/* Virtual Try-On Banner right under the gallery */}
          {product.collectionTag !== 'chemises-accessoires' && (
            <div className="detail-tryon-callout">
              <div>
                <span className="eyebrow">CABINE D&apos;ESSAYAGE VIRTUEL</span>
                <strong>Ce costume vous va-t-il ? Testez-le avec votre photo !</strong>
                <p>
                  Importez votre portrait ou prenez un selfie pour visualiser « {product.name} » sur vous avant de commander.
                </p>
              </div>
              <div className="detail-tryon-btns">
                <button
                  type="button"
                  onClick={() => setShowInlineTryOn(!showInlineTryOn)}
                  className="tryon-trigger-btn"
                >
                  <Camera size={16} />
                  <span>{showInlineTryOn ? 'Fermer la cabine' : 'Essayer ici sur ma photo'}</span>
                </button>
                <Link
                  href={`/essayage-virtuel?modele=${encodeURIComponent(product.slug)}`}
                  className="tryon-full-link"
                >
                  Plein écran ↗
                </Link>
              </div>
            </div>
          )}

          {/* Editorial Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="detail-highlights-box">
              <h3>Détails Tailleur &amp; Confection</h3>
              <ul>
                {product.highlights.map((h) => (
                  <li key={h}>
                    <Check size={15} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Product Configuration Panel */}
        <section className="product-panel">
          <p className="eyebrow">
            <span>{product.collectionLabel || 'LE VESTIAIRE AMPA'}</span>
            <span>RÉF. {product.reference}</span>
          </p>

          <h1>{product.name}</h1>
          {product.subtitle && <p className="detail-subtitle">{product.subtitle}</p>}

          <div className="detail-price-box">
            <strong className="detail-price">{formatPrice(unitTotal)}</strong>
            {product.compareAtPrice && (
              <span className="detail-compare-price">
                {formatPrice(product.compareAtPrice + activeFormula.priceDelta)}
              </span>
            )}
            <span className="detail-stock-badge">
              <Check size={12} /> En stock à Dakar
            </span>
          </div>

          <p className="detail-description">{product.description}</p>

          {/* Color Selector */}
          <div className="selection-block">
            <div className="selection-title">
              <span>1. Nuance choisie</span>
              <strong>{color.name}</strong>
            </div>
            <div className="color-options">
              {product.colors.map((option, i) => (
                <button
                  key={option.name}
                  type="button"
                  aria-label={`Choisir le coloris ${option.name}`}
                  aria-pressed={colorIndex === i}
                  onClick={() => setColorIndex(i)}
                  className={colorIndex === i ? 'selected' : ''}
                  style={{ '--swatch': option.hex } as React.CSSProperties}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector (No duplicate size banners) */}
          <div className="selection-block">
            <div className="selection-title">
              <span>2. Taille</span>
              <div className="selection-title-actions">
                <button
                  type="button"
                  onClick={() => setSizeModalOpen(true)}
                  className="inline-size-assistant-btn"
                >
                  <Sparkles size={13} />
                  <span>
                    {sizeProfile ? `Conseillée : ${sizeProfile.recommendedSize}` : 'Calculer ma taille'}
                  </span>
                </button>
                <Link
                  href={`/guide-des-tailles?retour=${encodeURIComponent(
                    `/produit/${product.slug}${from ? `?from=${encodeURIComponent(from)}` : ''}`
                  )}`}
                >
                  <Ruler size={12} /> Grille ↗
                </Link>
              </div>
            </div>

            <div className="size-options">
              {product.sizes.map((s) => {
                const isRec = sizeProfile?.recommendedSize === s
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    className={`${size === s ? 'selected' : ''} ${isRec ? 'recommended-ring' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    <span>{s}</span>
                    {isRec && <small className="size-rec-dot" title="Votre taille recommandée" />}
                  </button>
                )
              })}
            </div>
            {!size && (
              <p className="selection-hint">
                Sélectionnez votre taille ou lancez l&apos;<strong>Assistant Taille Morphologique</strong> pour calculer votre coupe idéale.
              </p>
            )}
          </div>

          {/* Formula / Pack Selector */}
          <div className="selection-block">
            <div className="selection-title">
              <span>3. Formule &amp; Accompagnement</span>
              <strong>{activeFormula.priceDelta > 0 ? `+${formatPrice(activeFormula.priceDelta)}` : 'Inclus'}</strong>
            </div>
            <div className="formula-cards-list">
              {availableFormulas.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFormulaId(f.id)}
                  className={`formula-card-option ${selectedFormulaId === f.id ? 'selected' : ''}`}
                >
                  <div className="formula-card-top">
                    <strong>{f.label}</strong>
                    <span>
                      {f.priceDelta === 0 ? 'Standard' : `+${formatPrice(f.priceDelta)}`}
                    </span>
                  </div>
                  <p>{f.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Unhemmed Trousers & Express 30-Min Tailor Option */}
          {product.unhemmedNote !== false && (
            <div className="selection-block hem-option-block">
              <div className="hem-banner-top">
                <Scissors size={17} />
                <div>
                  <strong>Service Retouche Ourlet Express (30 min)</strong>
                  <p>
                    Nos pantalons sont livrés sans ourlet afin de garantir un tombé parfait sur vos souliers. Un maître tailleur est disponible à proximité immédiate de la boutique pour une retouche ultra-rapide.
                  </p>
                </div>
              </div>

              <label className="hem-checkbox-label">
                <input
                  type="checkbox"
                  checked={hemRequested}
                  onChange={(e) => setHemRequested(e.target.checked)}
                />
                <span>
                  Demander la retouche d&apos;ourlet avant ma livraison (+3 000 FCFA)
                </span>
              </label>

              {hemRequested && (
                <div className="hem-length-input-row">
                  <label>
                    Longueur totale du pantalon ou entrejambe (en cm, optionnel) :
                    <input
                      type="text"
                      placeholder="Ex: 102 cm (ou à confirmer avec notre tailleur)"
                      value={hemLengthCm}
                      onChange={(e) => setHemLengthCm(e.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Dual CTA Buttons: Cart + WhatsApp */}
          <div className="detail-cta-group">
            <button type="button" className="primary-cart-button" onClick={handleAddToCart}>
              <div className="btn-left">
                <ShoppingBag size={18} />
                <span>Ajouter au panier</span>
              </div>
              <strong>{formatPrice(unitTotal)}</strong>
            </button>

            <div className="secondary-wa-row">
              <a
                className="wa-direct-button"
                href={waLink}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} />
                <span>Commander sur WhatsApp</span>
                <span className="wa-arrow">↗</span>
              </a>

              <button
                type="button"
                className="preview-msg-button"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Masquer' : 'Aperçu'}
              </button>
            </div>
          </div>

          {showPreview && (
            <div
              className="message-preview"
              role="dialog"
              aria-modal="true"
              aria-labelledby="preview-title"
            >
              <div className="preview-heading">
                <h2 id="preview-title">Récapitulatif de votre sélection</h2>
                <button onClick={() => setShowPreview(false)} aria-label="Fermer">
                  ×
                </button>
              </div>
              <pre>{message}</pre>
              <div className="preview-actions">
                <button
                  type="button"
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard?.writeText(message)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2500)
                  }}
                >
                  {copied ? 'Message copié !' : 'Copier le message'}
                </button>
                <a href={waLink} target="_blank" rel="noreferrer" className="preview-wa-link">
                  Ouvrir dans WhatsApp ↗
                </a>
              </div>
            </div>
          )}

          {/* Service Guarantees Box */}
          <div className="detail-service-guarantees">
            <div className="guarantee-row">
              <Truck size={16} />
              <div>
                <strong>{product.deliveryTime || 'Livraison Express 24h à Dakar'}</strong>
                <span>Plateau, Médina, Almadies, Mermoz, VDN, Parcelles &amp; expédition régions</span>
              </div>
            </div>
            <div className="guarantee-row">
              <ShieldCheck size={16} />
              <div>
                <strong>Paiement Wave, Orange Money ou à la livraison</strong>
                <span>WhatsApp Direct : {AMPA_WHATSAPP_DISPLAY} · Essayage possible au showroom</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Inline Expandable Virtual Try-On Studio on Product Page */}
      {showInlineTryOn && (
        <section className="inline-product-tryon-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ESSAYAGE VIRTUEL SUR MESURE</p>
              <h2>Testez « {product.name} » sur votre photo</h2>
            </div>
            <button
              type="button"
              className="filter-reset-btn"
              onClick={() => setShowInlineTryOn(false)}
            >
              Fermer la cabine ×
            </button>
          </div>
          <VirtualTryOn
            products={allProducts.length > 0 ? allProducts : [product, ...relatedProducts]}
            initialSlug={product.slug}
            compact
          />
        </section>
      )}

      {/* Cross-sell Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">COMPLÉTEZ VOTRE VESTIAIRE</p>
              <h2>Pièces assorties &amp; Recommandations</h2>
            </div>
            <Link className="text-link" href="/collections/costumes">
              Voir tout le catalogue ↗
            </Link>
          </div>
          <div className="product-grid">
            {relatedProducts.slice(0, 3).map((rp) => (
              <ProductCard key={rp.slug} product={rp} />
            ))}
          </div>
        </section>
      )}

      <div className="detail-back">
        <Link href={from || `/collections/${product.category}`}>← Retour à la collection</Link>
      </div>
    </main>
  )
}
