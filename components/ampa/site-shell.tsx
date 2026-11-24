'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import {
  Menu,
  X,
  ArrowUpRight,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  Scissors,
  PhoneCall,
  MapPin,
  Camera,
} from 'lucide-react'
import {
  DAKAR_ZONES,
  formatPrice,
  AMPA_WHATSAPP_DISPLAY,
  getWhatsAppUrl,
} from '@/lib/products'
import { useStore } from './store-context'
import { SizeAssistant } from './size-assistant'
import { BrandLogo } from './brand-logo'

export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.031 2C6.508 2 2.023 6.484 2.023 12.006c0 1.766.461 3.49 1.337 5.01L2 22l5.122-1.343a9.97 9.97 0 0 0 4.909 1.292h.004c5.522 0 10.006-4.484 10.006-10.006C22.041 6.484 17.554 2 12.031 2Zm5.822 14.132c-.246.694-1.432 1.326-1.988 1.408-.508.075-1.15.107-1.856-.117-.428-.136-.977-.318-1.682-.622-2.96-1.278-4.892-4.26-5.04-4.458-.147-.197-1.202-1.6-1.202-3.052 0-1.452.761-2.166 1.031-2.462.27-.296.589-.37.785-.37.197 0 .393.002.565.01.181.009.424-.069.663.507.246.591.835 2.042.908 2.19.074.148.123.32.025.517-.098.197-.147.32-.295.492-.147.173-.31.386-.442.518-.148.148-.301.308-.129.604.172.295.763 1.258 1.638 2.038 1.126 1.003 2.075 1.314 2.37 1.462.295.148.467.123.639-.074.172-.197.737-.861.933-1.157.197-.295.393-.246.663-.147.27.098 1.719.811 2.014.958.295.148.491.222.565.345.073.123.073.714-.173 1.408Z" />
    </svg>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const {
    cartCount,
    setCartOpen,
    sizeProfile,
    setSizeModalOpen,
    setSearchOpen,
  } = useStore()

  return (
    <header className="site-header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <BrandLogo variant="header" href="/" />
      </div>

      <nav className="desktop-nav" aria-label="Navigation principale">
        <Link
          href="/collections/costumes"
          className={pathname === '/collections/costumes' ? 'nav-active' : ''}
        >
          Costumes
        </Link>
        <Link href="/collections/costumes?coupe=smokings-gala">Smokings</Link>
        <Link
          href="/collections/manteaux"
          className={pathname === '/collections/manteaux' ? 'nav-active' : ''}
        >
          Safari &amp; Manteaux
        </Link>
        <Link
          href="/essayage-virtuel"
          className={`nav-highlight nav-tryon-pill ${pathname === '/essayage-virtuel' ? 'nav-active' : ''}`}
        >
          <Camera size={13} />
          Essayage
        </Link>
        <Link
          href="/guide-des-tailles"
          className={`nav-highlight ${pathname === '/guide-des-tailles' ? 'nav-active' : ''}`}
        >
          <Sparkles size={13} />
          {sizeProfile ? `Taille ${sizeProfile.recommendedSize}` : 'Ma Taille'}
        </Link>
        <Link
          href="/contact"
          className={pathname === '/contact' ? 'nav-active' : ''}
        >
          Contact
        </Link>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="icon-action-btn"
          onClick={() => setSearchOpen(true)}
          aria-label="Rechercher"
          title="Rechercher"
        >
          <Search size={17} />
        </button>

        <button
          type="button"
          className="cart-trigger-btn"
          onClick={() => setCartOpen(true)}
          aria-label="Ouvrir le panier"
        >
          <ShoppingBag size={16} />
          <span className="cart-trigger-text">Panier</span>
          <span className="cart-count-pill">{cartCount}</span>
        </button>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="Navigation mobile">
          <Link onClick={() => setOpen(false)} href="/collections/costumes">
            Costumes <span>01</span>
          </Link>
          <Link onClick={() => setOpen(false)} href="/collections/costumes?coupe=smokings-gala">
            Smokings <span>02</span>
          </Link>
          <Link onClick={() => setOpen(false)} href="/collections/manteaux">
            Safari &amp; Manteaux <span>03</span>
          </Link>
          <Link onClick={() => setOpen(false)} href="/essayage-virtuel">
            Essayage Virtuel <span>04</span>
          </Link>
          <Link onClick={() => setOpen(false)} href="/guide-des-tailles">
            {sizeProfile ? `Guide des Tailles (T.${sizeProfile.recommendedSize})` : 'Guide des Tailles'} <span>05</span>
          </Link>
          <Link onClick={() => setOpen(false)} href="/contact">
            Contact &amp; Cartes Cadeaux <span>06</span>
          </Link>
        </nav>
      )}
    </header>
  )
}

function SearchModal() {
  const { searchOpen, setSearchOpen, allProducts } = useStore()
  const [q, setQ] = useState('')

  if (!searchOpen) return null

  const normalized = q.trim().toLowerCase()
  const results = normalized
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(normalized) ||
          p.reference.toLowerCase().includes(normalized) ||
          p.description.toLowerCase().includes(normalized) ||
          (p.collectionLabel && p.collectionLabel.toLowerCase().includes(normalized)) ||
          p.colors.some((c) => c.name.toLowerCase().includes(normalized))
      )
    : allProducts.slice(0, 6)

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Recherche catalogue">
      <div className="search-modal-card">
        <div className="search-modal-header">
          <div className="search-input-wrap">
            <Search size={18} />
            <input
              type="search"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher : « Le Diplomate », « Croisé », « Safari », « Smoking »..."
            />
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setSearchOpen(false)}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="search-quick-tags">
          <span>Suggestions :</span>
          {['Croisé', 'Diplomate', 'Smoking', 'Safari', '3 Pièces', 'Manteau', 'Coffret'].map((tag) => (
            <button key={tag} type="button" onClick={() => setQ(tag)}>
              {tag}
            </button>
          ))}
        </div>

        <div className="search-results-grid">
          {results.length > 0 ? (
            results.map((product) => (
              <Link
                key={product.slug}
                href={`/produit/${product.slug}`}
                onClick={() => setSearchOpen(false)}
                className="search-result-item"
              >
                <div className="search-result-thumb">
                  <Image src={product.image} alt={product.name} fill sizes="80px" />
                </div>
                <div className="search-result-meta">
                  <small>
                    {product.reference} · {product.collectionLabel}
                  </small>
                  <strong>{product.name}</strong>
                  <span>{formatPrice(product.price) ?? 'Prix sur demande'}</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="search-empty">Aucune pièce ne correspond à « {q} ».</p>
          )}
        </div>
      </div>
    </div>
  )
}

function SizeAssistantModal() {
  const { sizeModalOpen, setSizeModalOpen } = useStore()
  if (!sizeModalOpen) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Assistant de taille">
      <div className="size-modal-card">
        <div className="size-modal-header">
          <div>
            <span className="eyebrow">TECHNOLOGIE MORPHOLOGIQUE AMPA · DAKAR</span>
            <h2>Assistant de Taille Intelligent</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setSizeModalOpen(false)}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="size-modal-body">
          <SizeAssistant compact onSelectSize={() => setSizeModalOpen(false)} />
        </div>
      </div>
    </div>
  )
}

function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    recordOrder,
    sizeProfile,
  } = useStore()

  const [zoneId, setZoneId] = useState(DAKAR_ZONES[0].id)
  const [paymentMethod, setPaymentMethod] = useState<'Wave' | 'Orange Money' | 'Paiement à la livraison'>('Wave')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [confirmedOrderNum, setConfirmedOrderNum] = useState<string | null>(null)

  if (!cartOpen) return null

  const selectedZone = DAKAR_ZONES.find((z) => z.id === zoneId) ?? DAKAR_ZONES[0]
  const total = cartSubtotal + (cart.length > 0 ? selectedZone.fee : 0)

  const buildWhatsAppOrderText = (orderNumber?: string) => {
    const lines = [
      `Bonjour *AMPA Boutique Dakar*, je souhaite valider ma commande${orderNumber ? ` *${orderNumber}*` : ''} :`,
      '',
      ...cart.map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* (${item.reference})\n   • Coloris : ${item.colorName} | Taille : *${item.size}* | Qté : ${item.quantity}\n   • Formule : ${item.formulaLabel}${item.hemRequested ? `\n   • Retouche Ourlet : Oui (${item.hemLengthCm ? `${item.hemLengthCm} cm` : 'à ajuster'})` : ''}\n   • Sous-total : ${formatPrice(item.unitPrice * item.quantity)}`
      ),
      '',
      `• *Livraison* : ${selectedZone.label} (${formatPrice(selectedZone.fee)})`,
      `• *Mode de règlement préféré* : ${paymentMethod}`,
      `• *TOTAL ESTIMÉ* : *${formatPrice(total)}*`,
    ]
    if (customerName || customerPhone) {
      lines.push(`• *Client* : ${customerName || 'À préciser'} (${customerPhone || 'À préciser'})`)
    }
    if (sizeProfile) {
      lines.push(
        `• *Profil Morphologique* : ${sizeProfile.heightCm}cm / ${sizeProfile.weightKg}kg (${sizeProfile.morphology}, Taille conseillée ${sizeProfile.recommendedSize})`
      )
    }
    return lines.join('\n')
  }

  const handleConfirmOnlineOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return
    const orderNum = `AMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    recordOrder({
      orderNumber: orderNum,
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: customerName || 'Client Prestige Dakar',
      customerPhone: customerPhone || AMPA_WHATSAPP_DISPLAY,
      zoneLabel: selectedZone.label,
      paymentMethod,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: selectedZone.fee,
      total,
      status: 'Confirmée · Préparation atelier & retouche',
    })
    setConfirmedOrderNum(orderNum)
    clearCart()
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Votre panier AMPA">
      <aside className="cart-drawer">
        <div className="cart-drawer-header">
          <div>
            <span className="eyebrow">SÉLECTION &amp; COMMANDE EXPRESS</span>
            <h2>Votre Panier ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => {
              setConfirmedOrderNum(null)
              setCartOpen(false)
            }}
            aria-label="Fermer le panier"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {confirmedOrderNum ? (
            <div className="cart-order-success">
              <CheckCircle2 size={44} className="success-icon" />
              <span className="eyebrow">COMMANDE ENREGISTRÉE</span>
              <h3>Référence : {confirmedOrderNum}</h3>
              <p>
                Votre demande a bien été enregistrée avec le mode <strong>{paymentMethod}</strong> et la zone{' '}
                <strong>{selectedZone.label}</strong>.
              </p>
              <div className="success-next-steps">
                <p>
                  Notre service client et notre maître tailleur à Dakar préparent votre pièce.
                </p>
                <a
                  href={getWhatsAppUrl(
                    `Bonjour AMPA Boutique, je viens de valider la commande ${confirmedOrderNum} sur le site (${paymentMethod}). Merci de me confirmer l'heure de livraison à Dakar !`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="cart-wa-btn"
                >
                  <WhatsAppIcon size={17} />
                  <span>Notifier le showroom sur WhatsApp</span>
                </a>
                <Link
                  href="/contact#suivi"
                  onClick={() => {
                    setConfirmedOrderNum(null)
                    setCartOpen(false)
                  }}
                  className="cart-track-link"
                >
                  Suivre ma commande {confirmedOrderNum} →
                </Link>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={40} strokeWidth={1.25} />
              <h3>Votre sélection est vide</h3>
              <p>
                Explorez nos costumes croisés « Le Diplomate », testez un modèle sur votre photo dans la Cabine d&apos;Essayage Virtuel ou calculez votre taille idéale.
              </p>
              <Link
                href="/collections/costumes"
                onClick={() => setCartOpen(false)}
                className="cart-explore-btn"
              >
                Explorer la boutique ↗
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-thumb">
                      <Image src={item.image} alt={item.name} fill sizes="80px" />
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <strong>{item.name}</strong>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Retirer"
                          className="cart-remove-btn"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="cart-item-specs">
                        Réf. {item.reference} · Coloris : <span>{item.colorName}</span> · Taille :{' '}
                        <strong>{item.size}</strong>
                      </p>
                      <p className="cart-item-formula">{item.formulaLabel}</p>
                      {item.hemRequested && (
                        <p className="cart-item-hem">
                          <Scissors size={12} /> Retouche ourlet express ({item.hemLengthCm ? `${item.hemLengthCm} cm` : 'Sur mesure'})
                        </p>
                      )}
                      <div className="cart-item-bottom">
                        <div className="qty-stepper">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Diminuer"
                          >
                            <Minus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Augmenter"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <strong className="cart-item-price">{formatPrice(item.unitPrice * item.quantity)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleConfirmOnlineOrder} className="cart-checkout-form">
                <div className="cart-form-block">
                  <label className="cart-form-label">
                    <Truck size={14} /> Zone de livraison (Dakar &amp; Sénégal)
                  </label>
                  <select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="cart-select"
                  >
                    {DAKAR_ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.label} ({z.fee === 0 ? 'Gratuit' : formatPrice(z.fee)})
                      </option>
                    ))}
                  </select>
                  <small className="cart-zone-delay">{selectedZone.delay}</small>
                </div>

                <div className="cart-form-block">
                  <label className="cart-form-label">Mode de paiement préféré</label>
                  <div className="payment-pills">
                    {(['Wave', 'Orange Money', 'Paiement à la livraison'] as const).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPaymentMethod(pm)}
                        className={`payment-pill ${paymentMethod === pm ? 'selected' : ''}`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cart-customer-row">
                  <input
                    type="text"
                    placeholder="Votre nom complet"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Votre téléphone"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="cart-totals-box">
                  <div className="cart-total-line">
                    <span>Sous-total pièces</span>
                    <span>{formatPrice(cartSubtotal)}</span>
                  </div>
                  <div className="cart-total-line">
                    <span>Frais de livraison ({selectedZone.label.split('/')[0].trim()})</span>
                    <span>{selectedZone.fee === 0 ? 'Offert' : formatPrice(selectedZone.fee)}</span>
                  </div>
                  <div className="cart-total-line grand-total">
                    <span>Total TTC</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                </div>

                <button type="submit" className="cart-submit-btn">
                  <span>Valider la commande ({paymentMethod})</span>
                  <ArrowUpRight size={17} />
                </button>

                <a
                  href={getWhatsAppUrl(buildWhatsAppOrderText())}
                  target="_blank"
                  rel="noreferrer"
                  className="cart-wa-btn"
                >
                  <WhatsAppIcon size={17} />
                  <span>Commander sur WhatsApp</span>
                </a>
              </form>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

export function Footer() {
  const { setSizeModalOpen } = useStore()

  return (
    <footer className="site-footer">
      <div className="footer-main-grid">
        <div className="footer-brand-col">
          <BrandLogo variant="footer" href="/" />
          <p className="footer-brand-desc">
            La référence du costume croisé « Le Diplomate », des ensembles 2 &amp; 3 pièces en laine Super 200&apos;s, des smokings de cérémonie et du vestiaire safari haut de gamme à Dakar.
          </p>
        </div>

        <div className="footer-col">
          <h3>Collections</h3>
          <div className="footer-links">
            <Link href="/collections/costumes?coupe=croises">Costumes Croisés « Le Diplomate »</Link>
            <Link href="/collections/costumes?coupe=deux-trois-pieces">Costumes 2 &amp; 3 Pièces VIP</Link>
            <Link href="/collections/costumes?coupe=smokings-gala">Smokings de Mariage &amp; Gala</Link>
            <Link href="/collections/manteaux?coupe=safari-sahelien">Costumes Safari Sahéliens</Link>
            <Link href="/collections/manteaux?coupe=manteaux-blazers">Manteaux Longs &amp; Cachemire</Link>
            <Link href="/collections/manteaux?coupe=chemises-accessoires">Chemises &amp; Coffrets Cravates</Link>
          </div>
        </div>

        <div className="footer-col">
          <h3>Innovations &amp; Sur-Mesure</h3>
          <div className="footer-links">
            <Link href="/essayage-virtuel">Cabine d&apos;Essayage Virtuel Photo</Link>
            <button type="button" onClick={() => setSizeModalOpen(true)} className="footer-link-btn">
              Assistant de Taille Interactif
            </button>
            <Link href="/guide-des-tailles">Guide de Prise de Mesures &amp; Grille</Link>
            <Link href="/contact#corporate">Corporate Dress Plan (Entreprises)</Link>
            <Link href="/contact#cartes-cadeaux">Cartes Cadeaux Digitales AMPA</Link>
            <Link href="/contact#suivi">Suivi de Commande en Ligne</Link>
          </div>
        </div>

        <div className="footer-col">
          <h3>Showroom &amp; Contact Direct</h3>
          <div className="footer-contact-details">
            <p>
              <MapPin size={14} /> <strong>Showroom Dakar :</strong> Médina / Plateau, Dakar — Sénégal
            </p>
            <p>
              <PhoneCall size={14} /> <strong>Horaires :</strong> Lun–Sam, 09h30 – 20h30
            </p>
          </div>
          <a
            className="footer-wa-cta"
            href={getWhatsAppUrl('Bonjour AMPA Boutique Dakar, je souhaite être conseillé sur une tenue.')}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={17} />
            <span>Échanger sur WhatsApp</span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} AMPA Boutique · Dakar, Sénégal</span>
        <div className="footer-bottom-right">
          <span>Super 200&apos;s &amp; Prêt-à-Porter de Luxe</span>
          <Link href="/admin" className="footer-admin-link">
            Espace Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}

function FloatingConcierge() {
  return (
    <div className="floating-concierge">
      <a
        href={getWhatsAppUrl('Bonjour AMPA Boutique Dakar, je visite votre site et je souhaite un conseil.')}
        target="_blank"
        rel="noreferrer"
        className="floating-wa-icon-only"
        aria-label="Contacter AMPA sur WhatsApp"
        title="Discuter sur WhatsApp"
      >
        <WhatsAppIcon size={24} />
      </a>
    </div>
  )
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <SearchModal />
      <SizeAssistantModal />
      <CartDrawer />
      <FloatingConcierge />
    </>
  )
}
