'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Scissors,
  Gift,
  Settings,
  Plus,
  Search,
  Edit3,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Upload,
  X,
  TrendingUp,
  Briefcase,
  Download,
  Wand2,
  KeyRound,
  Sparkles,
} from 'lucide-react'
import type { Product, ProductSubcategory } from '@/lib/products'
import {
  DAKAR_ZONES,
  formatPrice,
  defaultFormulas,
  AMPA_WHATSAPP_DISPLAY,
} from '@/lib/products'
import {
  useStore,
  type OrderStatus,
  type OrderRecord,
} from './store-context'
import { BrandLogo } from './brand-logo'
import { WhatsAppIcon } from './site-shell'

type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'tailor'
  | 'giftcards'
  | 'settings'

const STUDIO_IMAGES = [
  { label: 'Le Diplomate Olive', src: '/ampa-hero.png' },
  { label: 'Le Diplomate Tabac', src: '/ampa-diplomate.png' },
  { label: 'Costume Bleu Nuit', src: '/ampa-suit.png' },
  { label: '3 Pièces Gris Perle', src: '/ampa-three-piece.png' },
  { label: 'Smoking Gala Noir', src: '/ampa-smoking.png' },
  { label: 'Safari Beige Sable', src: '/ampa-safari.png' },
  { label: 'Manteau Long Camel', src: '/ampa-coat.png' },
  { label: 'Coffret Accessoires', src: '/ampa-accessories.png' },
]

const COLLECTION_OPTIONS: {
  tag: ProductSubcategory
  label: string
  category: 'costumes' | 'manteaux'
}[] = [
  { tag: 'croises', label: 'Costumes Croisés', category: 'costumes' },
  { tag: 'deux-trois-pieces', label: '2 & 3 Pièces', category: 'costumes' },
  { tag: 'smokings-gala', label: 'Smokings & Gala', category: 'costumes' },
  { tag: 'safari-sahelien', label: 'Costumes Safari', category: 'manteaux' },
  { tag: 'manteaux-blazers', label: 'Manteaux & Blazers', category: 'manteaux' },
  { tag: 'chemises-accessoires', label: 'Accessoires', category: 'manteaux' },
]

const ORDER_STATUSES: OrderStatus[] = [
  'En attente',
  'Confirmée · Préparation atelier & retouche',
  'Atelier · Ourlet 30 min en cours',
  'En cours de livraison Dakar',
  'Livrée',
  'Annulée',
]

const TAB_META: Record<AdminTab, { eyebrow: string; title: string; subtitle: string }> = {
  overview: {
    eyebrow: 'PILOTAGE MAISON AMPA · DAKAR',
    title: 'Tableau de bord.',
    subtitle: 'Suivi en temps réel des ventes, livraisons express 24h et retouches atelier.',
  },
  products: {
    eyebrow: 'ÉDITION DU VESTIAIRE',
    title: 'Catalogue & Collections.',
    subtitle: 'Gérez vos costumes Super 200’s, smokings, ensembles Safari, tarifs et stocks.',
  },
  orders: {
    eyebrow: 'LOGISTIQUE & CONCIERGERIE',
    title: 'Commandes & Livraisons.',
    subtitle: 'Pilotez les expéditions à Dakar et notifiez vos clients en un clic sur WhatsApp.',
  },
  tailor: {
    eyebrow: 'MAÎTRE TAILLEUR · SERVICE 30 MIN',
    title: 'Atelier & Ourlets.',
    subtitle: 'Suivi des pantalons livrés bruts d’ourlet à ajuster avant remise au coursier.',
  },
  giftcards: {
    eyebrow: 'PRIVILÈGES & ÉVÉNEMENTS',
    title: 'Cartes Cadeaux & Corporate.',
    subtitle: 'Émission de cartes digitales AMPA et suivi des devis mariages & institutions.',
  },
  settings: {
    eyebrow: 'CONFIGURATION SYSTÈME & IA',
    title: 'Paramètres & Sauvegarde.',
    subtitle: 'Clés du studio d’essayage IA, zones de livraison Dakar et export des données.',
  },
}

function getStatusTone(status: string): 'emerald' | 'gold' | 'muted' {
  const s = status.toLowerCase()
  if (s.includes('livrée') || s.includes('terminé') || s.includes('validé') || s.includes('active')) {
    return 'emerald'
  }
  if (s.includes('annulée') || s.includes('utilisée')) {
    return 'muted'
  }
  return 'gold'
}

export function AdminDashboard() {
  const {
    allProducts,
    upsertProduct,
    deleteProduct,
    resetCatalog,
    orders,
    recordOrder,
    updateOrderStatus,
    updateOrderHemStatus,
    deleteOrder,
    giftCards,
    addGiftCard,
    toggleGiftCardStatus,
    corporateLeads,
    updateCorporateLeadStatus,
  } = useStore()

  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [productQuery, setProductQuery] = useState('')
  const [productFilterTag, setProductFilterTag] = useState<string>('all')

  // Order search & status filter
  const [orderQuery, setOrderQuery] = useState('')
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'tailor' | 'delivered'>('all')

  // Product Add/Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [sizesInput, setSizesInput] = useState('46, 48, 50, 52, 54, 56, 58')
  const [colorNameInput, setColorNameInput] = useState('')
  const [colorHexInput, setColorHexInput] = useState('#4a5240')

  // Manual Order Modal State
  const [newOrderModal, setNewOrderModal] = useState(false)
  const [moName, setMoName] = useState('')
  const [moPhone, setMoPhone] = useState('')
  const [moProductSlug, setMoProductSlug] = useState(allProducts[0]?.slug || '')
  const [moSize, setMoSize] = useState('50')
  const [moHem, setMoHem] = useState(true)
  const [moHemCm, setMoHemCm] = useState('103')
  const [moPayment, setMoPayment] = useState<'Wave' | 'Orange Money' | 'Paiement à la livraison'>('Wave')
  const [moZone, setMoZone] = useState(DAKAR_ZONES[0].label)

  // New Gift Card Form State
  const [newGcAmount, setNewGcAmount] = useState(95000)
  const [newGcRecipient, setNewGcRecipient] = useState('')
  const [newGcSender, setNewGcSender] = useState('')

  // AI Try-On Keys Setting State (Hugging Face Free Token + Gemini Key)
  const [hfTokenInput, setHfTokenInput] = useState('')
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [keySavedToast, setKeySavedToast] = useState(false)

  useEffect(() => {
    try {
      const storedGemini = localStorage.getItem('ampa_gemini_key_v1')
      if (storedGemini) setGeminiApiKey(storedGemini)
      const storedHf = localStorage.getItem('ampa_hf_token_v1')
      if (storedHf) setHfTokenInput(storedHf)
    } catch {}
  }, [])

  const handleSaveAiKeys = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const cleanGemini = geminiApiKey.trim()
      const cleanHf = hfTokenInput.trim()
      if (cleanGemini) {
        localStorage.setItem('ampa_gemini_key_v1', cleanGemini)
      } else {
        localStorage.removeItem('ampa_gemini_key_v1')
      }
      if (cleanHf) {
        localStorage.setItem('ampa_hf_token_v1', cleanHf)
      } else {
        localStorage.removeItem('ampa_hf_token_v1')
      }
      setKeySavedToast(true)
      setTimeout(() => setKeySavedToast(false), 3000)
    } catch {}
  }

  // Computed KPIs
  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== 'Annulée')
        .reduce((sum, o) => sum + o.total, 0),
    [orders]
  )

  const activeOrdersCount = useMemo(
    () => orders.filter((o) => o.status !== 'Livrée' && o.status !== 'Annulée').length,
    [orders]
  )

  const tailorQueue = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.items.some((i) => i.hemRequested) ||
          (o.hemStatus && o.hemStatus !== 'Standard (sans ourlet)')
      ),
    [orders]
  )

  const pendingHemsCount = useMemo(
    () => tailorQueue.filter((o) => o.hemStatus !== 'Ourlet terminé').length,
    [tailorQueue]
  )

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase()
    return allProducts.filter((p) => {
      const matchTag = productFilterTag === 'all' || p.collectionTag === productFilterTag
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q) ||
        (p.collectionLabel && p.collectionLabel.toLowerCase().includes(q))
      return matchTag && matchQ
    })
  }, [allProducts, productQuery, productFilterTag])

  const filteredOrders = useMemo(() => {
    const q = orderQuery.trim().toLowerCase()
    return orders.filter((o) => {
      const matchFilter =
        orderFilter === 'all'
          ? true
          : orderFilter === 'active'
            ? o.status !== 'Livrée' && o.status !== 'Annulée'
            : orderFilter === 'tailor'
              ? o.status.includes('Atelier') || o.items.some((i) => i.hemRequested)
              : o.status === 'Livrée'

      const matchQ =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      return matchFilter && matchQ
    })
  }, [orders, orderQuery, orderFilter])

  const openCreateProduct = () => {
    const nextNum = 100 + allProducts.length + 1
    setIsNewProduct(true)
    setSizesInput('46, 48, 50, 52, 54, 56, 58')
    setEditingProduct({
      slug: `nouveau-modele-am-${nextNum}`,
      name: '',
      subtitle: "Coupe structurée · Super 200's 100% Laine",
      reference: `AM-${nextNum}`,
      category: 'costumes',
      collectionTag: 'croises',
      collectionLabel: 'Costumes Croisés',
      badge: 'NOUVEAUTÉ',
      fabric: "Super 200's · 100% Laine",
      cut: 'Coupe Ajustée',
      image: '/ampa-hero.png',
      colors: [{ name: 'Vert Olive', hex: '#4a5240', image: '/ampa-hero.png' }],
      sizes: ['46', '48', '50', '52', '54', '56', '58'],
      price: 95000,
      compareAtPrice: 110000,
      formulas: defaultFormulas,
      availability: 'available',
      deliveryTime: 'Livraison Express 24h à Dakar',
      description:
        "Pièce confectionnée en laine Super 200's respirante, livrée avec réserve d'ourlet et housse griffée AMPA.",
      unhemmedNote: true,
      featured: true,
    })
  }

  const openEditProduct = (prod: Product) => {
    setIsNewProduct(false)
    setSizesInput(prod.sizes.join(', '))
    setEditingProduct({ ...prod, colors: [...prod.colors] })
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !editingProduct.name.trim()) return

    const cleanSlug = isNewProduct
      ? editingProduct.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
        '-' +
        editingProduct.reference.toLowerCase()
      : editingProduct.slug

    const colOption =
      COLLECTION_OPTIONS.find((c) => c.tag === editingProduct.collectionTag) ??
      COLLECTION_OPTIONS[0]

    const parsedSizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    upsertProduct({
      ...editingProduct,
      slug: cleanSlug,
      category: colOption.category,
      collectionLabel: colOption.label,
      sizes: parsedSizes.length > 0 ? parsedSizes : ['48', '50', '52', '54'],
    })
    setEditingProduct(null)
  }

  const handleImageFileUpload = (file: File) => {
    if (!file || !editingProduct) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result
        setEditingProduct((prev) =>
          prev
            ? {
                ...prev,
                image: dataUrl,
                colors: prev.colors.map((c, i) => (i === 0 ? { ...c, image: dataUrl } : c)),
              }
            : null
        )
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const prod = allProducts.find((p) => p.slug === moProductSlug) ?? allProducts[0]
    if (!prod) return
    const unitPrice = (prod.price ?? 90000) + (moHem ? 3000 : 0)
    const orderNumber = `AMP-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const newOrder: OrderRecord = {
      orderNumber,
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: moName || 'Client Showroom Dakar',
      customerPhone: moPhone || '+221 77 000 00 00',
      zoneLabel: moZone,
      paymentMethod: moPayment,
      items: [
        {
          id: `mo-${Date.now()}`,
          slug: prod.slug,
          name: prod.name,
          reference: prod.reference,
          image: prod.image,
          colorName: prod.colors[0]?.name || 'Standard',
          colorHex: prod.colors[0]?.hex || '#0e291e',
          size: moSize,
          formulaLabel: 'Commande Showroom / Directe',
          unitPrice,
          hemRequested: moHem,
          hemLengthCm: moHem ? moHemCm : undefined,
          quantity: 1,
        },
      ],
      subtotal: unitPrice,
      deliveryFee: 0,
      total: unitPrice,
      status: moHem
        ? 'Atelier · Ourlet 30 min en cours'
        : 'Confirmée · Préparation atelier & retouche',
      hemStatus: moHem ? 'À retoucher' : 'Standard (sans ourlet)',
    }
    recordOrder(newOrder)
    setNewOrderModal(false)
    setMoName('')
    setMoPhone('')
  }

  const handleIssueGiftCard = (e: React.FormEvent) => {
    e.preventDefault()
    const code = `AMPA-${newGcAmount / 1000}K-${Math.floor(1000 + Math.random() * 9000)}`
    addGiftCard({
      code,
      title:
        newGcAmount >= 125000
          ? 'Édition Gala & Souverain'
          : newGcAmount >= 95000
            ? 'Édition Le Diplomate'
            : 'Édition Présidentielle',
      amount: newGcAmount,
      recipient: newGcRecipient || 'Invité Prestige',
      sender: newGcSender || 'Showroom AMPA',
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Active',
    })
    setNewGcRecipient('')
    setNewGcSender('')
  }

  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      products: allProducts,
      orders,
      giftCards,
      corporateLeads,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ampa-boutique-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  const meta = TAB_META[activeTab]

  return (
    <div className="admin-shell">
      {/* Forest Emerald Editorial Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <BrandLogo variant="footer" href="/admin" />
          <div className="admin-live-pill">
            <i className="admin-live-dot" />
            <span>ESPACE ADMIN · DAKAR</span>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Menu administration">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <span className="admin-nav-left">
              <LayoutDashboard size={17} />
              <span>Vue d’ensemble</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          >
            <span className="admin-nav-left">
              <Package size={17} />
              <span>Catalogue</span>
            </span>
            <em className="admin-nav-count">{allProducts.length}</em>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          >
            <span className="admin-nav-left">
              <ShoppingBag size={17} />
              <span>Commandes</span>
            </span>
            <em className="admin-nav-count">{orders.length}</em>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tailor')}
            className={`admin-nav-btn ${activeTab === 'tailor' ? 'active' : ''}`}
          >
            <span className="admin-nav-left">
              <Scissors size={17} />
              <span>Atelier Ourlets</span>
            </span>
            {pendingHemsCount > 0 && (
              <em className="admin-nav-count gold">{pendingHemsCount}</em>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('giftcards')}
            className={`admin-nav-btn ${activeTab === 'giftcards' ? 'active' : ''}`}
          >
            <span className="admin-nav-left">
              <Gift size={17} />
              <span>Cartes &amp; Corporate</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <span className="admin-nav-left">
              <Settings size={17} />
              <span>Paramètres &amp; IA</span>
            </span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/essayage-virtuel" className="admin-sidebar-sublink">
            <Sparkles size={14} />
            <span>Atelier Essayage IA</span>
          </Link>
          <Link href="/" className="admin-storefront-link">
            <span>Retour à la boutique</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Editorial Hero Header matching Public Storefront */}
        <header className="admin-topbar">
          <div className="admin-topbar-copy">
            <span className="admin-eyebrow-pill">{meta.eyebrow}</span>
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-action-btn secondary"
              onClick={() => setNewOrderModal(true)}
            >
              <Plus size={15} />
              <span>Commande Showroom</span>
            </button>
            <button
              type="button"
              className="admin-action-btn primary"
              onClick={() => {
                setActiveTab('products')
                openCreateProduct()
              }}
            >
              <Plus size={15} />
              <span>Nouveau modèle</span>
            </button>
          </div>
        </header>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="admin-section-stack">
            <div className="admin-kpi-grid">
              <article
                className="admin-kpi-card highlight"
                onClick={() => setActiveTab('orders')}
              >
                <div className="kpi-head">
                  <span>Chiffre d&apos;affaires validé</span>
                  <div className="kpi-icon-box">
                    <TrendingUp size={17} />
                  </div>
                </div>
                <strong>{formatPrice(totalRevenue)}</strong>
                <small>{orders.length} commandes enregistrées</small>
              </article>

              <article
                className="admin-kpi-card"
                onClick={() => {
                  setOrderFilter('active')
                  setActiveTab('orders')
                }}
              >
                <div className="kpi-head">
                  <span>Commandes actives</span>
                  <div className="kpi-icon-box">
                    <Truck size={17} />
                  </div>
                </div>
                <strong>{activeOrdersCount}</strong>
                <small>Livraison Express 24h Dakar</small>
              </article>

              <article
                className="admin-kpi-card"
                onClick={() => setActiveTab('tailor')}
              >
                <div className="kpi-head">
                  <span>Ourlets 30 min à piquer</span>
                  <div className="kpi-icon-box">
                    <Scissors size={17} />
                  </div>
                </div>
                <strong>{pendingHemsCount}</strong>
                <small>Sur {tailorQueue.length} pantalons suivis</small>
              </article>

              <article
                className="admin-kpi-card"
                onClick={() => setActiveTab('products')}
              >
                <div className="kpi-head">
                  <span>Vestiaire en ligne</span>
                  <div className="kpi-icon-box">
                    <Package size={17} />
                  </div>
                </div>
                <strong>{allProducts.length} pièces</strong>
                <small>Costumes, Smokings, Safari &amp; Manteaux</small>
              </article>
            </div>

            <div className="admin-two-col">
              {/* Recent Orders */}
              <section className="admin-panel">
                <div className="admin-panel-head">
                  <div>
                    <span className="eyebrow">FLUX RÉCENT</span>
                    <h2>Dernières commandes</h2>
                  </div>
                  <button
                    type="button"
                    className="admin-text-btn"
                    onClick={() => setActiveTab('orders')}
                  >
                    Tout voir ↗
                  </button>
                </div>

                <div className="admin-orders-mini-list">
                  {orders.slice(0, 4).map((ord) => (
                    <div key={ord.orderNumber} className="admin-mini-order">
                      <div>
                        <strong>
                          {ord.orderNumber} · {ord.customerName}
                        </strong>
                        <span>
                          {ord.items.map((i) => `${i.name} (T.${i.size})`).join(', ')}
                        </span>
                        <small>
                          {ord.paymentMethod} · {ord.zoneLabel.split('/')[0]}
                        </small>
                      </div>
                      <div className="admin-mini-order-right">
                        <strong>{formatPrice(ord.total)}</strong>
                        <span className={`admin-status-badge ${getStatusTone(ord.status)}`}>
                          {ord.status.split('·')[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Active Tailor Queue & Corporate Leads */}
              <section className="admin-panel">
                <div className="admin-panel-head">
                  <div>
                    <span className="eyebrow">ATELIER &amp; CORTÈGES</span>
                    <h2>Retouches &amp; Devis Groupe</h2>
                  </div>
                  <button
                    type="button"
                    className="admin-text-btn"
                    onClick={() => setActiveTab('tailor')}
                  >
                    Atelier ↗
                  </button>
                </div>

                <div className="admin-orders-mini-list">
                  {tailorQueue.slice(0, 2).map((ord) => (
                    <div key={ord.orderNumber} className="admin-mini-order">
                      <div>
                        <strong>
                          <Scissors size={13} /> Ourlet {ord.orderNumber} ({ord.customerName})
                        </strong>
                        <span>
                          Longueur :{' '}
                          <strong>
                            {ord.items.find((i) => i.hemRequested)?.hemLengthCm || '103'} cm
                          </strong>{' '}
                          · Taille {ord.items[0]?.size}
                        </span>
                      </div>
                      <span
                        className={`admin-status-badge ${getStatusTone(ord.hemStatus || 'À retoucher')}`}
                      >
                        {ord.hemStatus || 'À retoucher'}
                      </span>
                    </div>
                  ))}

                  {corporateLeads.slice(0, 2).map((lead) => (
                    <div key={lead.id} className="admin-mini-order">
                      <div>
                        <strong>
                          <Briefcase size={13} /> {lead.organization}
                        </strong>
                        <span>
                          {lead.quantity} tenues · {lead.collection}
                        </span>
                      </div>
                      <div className="admin-mini-order-right">
                        <strong>{formatPrice(lead.estimatedTotal)}</strong>
                        <span className={`admin-status-badge ${getStatusTone(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS & CATALOG TAB */}
        {activeTab === 'products' && (
          <div className="admin-section-stack">
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={16} />
                <input
                  type="search"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Rechercher un modèle ou une référence (AM-101)..."
                />
              </div>

              <div className="admin-filter-pills">
                <button
                  type="button"
                  onClick={() => setProductFilterTag('all')}
                  className={`admin-pill ${productFilterTag === 'all' ? 'active' : ''}`}
                >
                  Tous ({allProducts.length})
                </button>
                {COLLECTION_OPTIONS.map((c) => (
                  <button
                    key={c.tag}
                    type="button"
                    onClick={() => setProductFilterTag(c.tag)}
                    className={`admin-pill ${productFilterTag === c.tag ? 'active' : ''}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="admin-reset-btn"
                onClick={resetCatalog}
                title="Restaurer le catalogue par défaut"
              >
                <RotateCcw size={13} /> Réinitialiser
              </button>
            </div>

            <div className="admin-products-grid">
              {filteredProducts.map((prod) => (
                <article key={prod.slug} className="admin-product-card">
                  <div className="admin-prod-thumb">
                    <Image src={prod.image} alt={prod.name} fill sizes="160px" />
                    {prod.badge && <span className="admin-prod-badge">{prod.badge}</span>}
                  </div>

                  <div className="admin-prod-body">
                    <div className="admin-prod-top">
                      <small>
                        {prod.reference} · {prod.collectionLabel}
                      </small>
                      <span
                        className={`admin-stock-dot ${prod.availability === 'available' ? 'in-stock' : 'on-request'}`}
                      >
                        {prod.availability === 'available' ? 'En stock' : 'Sur commande'}
                      </span>
                    </div>

                    <h3>{prod.name}</h3>
                    <p className="admin-prod-price">
                      <strong>{formatPrice(prod.price) ?? 'Sur demande'}</strong>
                    </p>

                    <div className="admin-prod-meta">
                      <span>T. {prod.sizes[0]}–{prod.sizes[prod.sizes.length - 1]}</span>
                      <div className="admin-prod-swatches">
                        {prod.colors.map((c) => (
                          <i
                            key={c.name}
                            title={c.name}
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="admin-prod-actions">
                      <button
                        type="button"
                        className="admin-edit-btn"
                        onClick={() => openEditProduct(prod)}
                      >
                        <Edit3 size={13} /> Modifier
                      </button>
                      <Link
                        href={`/produit/${prod.slug}`}
                        className="admin-view-btn"
                        title="Voir la fiche publique"
                      >
                        <ArrowUpRight size={15} />
                      </Link>
                      <button
                        type="button"
                        className="admin-del-btn"
                        onClick={() => deleteProduct(prod.slug)}
                        title="Supprimer ce modèle"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 3. ORDERS & DELIVERIES TAB */}
        {activeTab === 'orders' && (
          <div className="admin-section-stack">
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={16} />
                <input
                  type="search"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Rechercher par N° commande (AMP-2026...), client ou téléphone..."
                />
              </div>

              <div className="admin-filter-pills">
                <button
                  type="button"
                  onClick={() => setOrderFilter('all')}
                  className={`admin-pill ${orderFilter === 'all' ? 'active' : ''}`}
                >
                  Toutes ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('active')}
                  className={`admin-pill ${orderFilter === 'active' ? 'active' : ''}`}
                >
                  En cours ({activeOrdersCount})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('tailor')}
                  className={`admin-pill ${orderFilter === 'tailor' ? 'active' : ''}`}
                >
                  Avec ourlet ({tailorQueue.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('delivered')}
                  className={`admin-pill ${orderFilter === 'delivered' ? 'active' : ''}`}
                >
                  Livrées
                </button>
              </div>
            </div>

            <div className="admin-orders-list">
              {filteredOrders.map((ord) => {
                const cleanPhone = ord.customerPhone.replace(/\D/g, '') || '221784211649'
                const waCustomerMsg = `Bonjour ${ord.customerName}, ici la Maison AMPA Boutique Dakar. Votre commande *${ord.orderNumber}* (${formatPrice(ord.total)}) est au statut : *${ord.status}*.`
                return (
                  <article key={ord.orderNumber} className="admin-order-card">
                    <div className="admin-order-header">
                      <div>
                        <div className="admin-order-ref-row">
                          <span className="admin-order-ref">{ord.orderNumber}</span>
                          <span className={`admin-status-badge ${getStatusTone(ord.status)}`}>
                            {ord.status}
                          </span>
                        </div>
                        <strong className="admin-customer-name">{ord.customerName}</strong>
                        <span className="admin-order-date">
                          <Clock size={12} /> {ord.createdAt} · {ord.customerPhone}
                        </span>
                      </div>

                      <div className="admin-order-header-right">
                        <strong className="admin-order-total">{formatPrice(ord.total)}</strong>
                        <span className="admin-payment-pill">{ord.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="admin-order-items">
                      {ord.items.map((item) => (
                        <div key={item.id} className="admin-order-item-row">
                          <div className="admin-order-item-thumb">
                            <Image src={item.image} alt={item.name} fill sizes="60px" />
                          </div>
                          <div className="admin-order-item-info">
                            <strong>
                              {item.name} <small>({item.reference})</small>
                            </strong>
                            <span>
                              {item.colorName} · Taille <strong>{item.size}</strong> · Qté{' '}
                              {item.quantity} · {item.formulaLabel}
                            </span>
                            {item.hemRequested && (
                              <span className="admin-hem-tag">
                                <Scissors size={12} /> Ourlet 30 min ({item.hemLengthCm || 'à mesurer'} cm)
                              </span>
                            )}
                          </div>
                          <strong className="admin-item-subtotal">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="admin-order-footer">
                      <div className="admin-order-zone">
                        <Truck size={14} />
                        <span>{ord.zoneLabel}</span>
                      </div>

                      <div className="admin-order-controls">
                        <label className="admin-status-select-label">
                          <span>Étape :</span>
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              updateOrderStatus(ord.orderNumber, e.target.value as OrderStatus)
                            }
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </label>

                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waCustomerMsg)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-wa-client-btn"
                          title="Notifier le client sur WhatsApp"
                        >
                          <WhatsAppIcon size={15} />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          className="admin-del-btn"
                          onClick={() => deleteOrder(ord.orderNumber)}
                          title="Supprimer la commande"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. TAILOR & 30-MIN HEM WORKSHOP TAB */}
        {activeTab === 'tailor' && (
          <div className="admin-section-stack">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="eyebrow">SUIVI COUTURE EXPRESS</span>
                  <h2>File d&apos;attente Maître Tailleur</h2>
                  <p className="admin-panel-sub">
                    Tous les pantalons Super 200&apos;s sont livrés bruts d&apos;ourlet. Marquez l&apos;avancement de chaque retouche avant expédition.
                  </p>
                </div>
              </div>

              <div className="admin-tailor-grid">
                {tailorQueue.map((ord) => {
                  const hemItem = ord.items.find((i) => i.hemRequested) ?? ord.items[0]
                  const currentHemStatus = ord.hemStatus || 'À retoucher'
                  return (
                    <article key={ord.orderNumber} className="admin-tailor-card">
                      <div className="admin-tailor-top">
                        <span className="admin-order-ref">{ord.orderNumber}</span>
                        <span className={`admin-status-badge ${getStatusTone(currentHemStatus)}`}>
                          {currentHemStatus}
                        </span>
                      </div>

                      <h3>{hemItem?.name}</h3>
                      <ul className="admin-tailor-specs">
                        <li>
                          <span>Client</span>
                          <strong>{ord.customerName}</strong>
                        </li>
                        <li>
                          <span>Taille</span>
                          <strong>Taille {hemItem?.size}</strong>
                        </li>
                        <li>
                          <span>Ourlet demandé</span>
                          <strong className="highlight-measure">
                            {hemItem?.hemLengthCm ? `${hemItem.hemLengthCm} cm` : 'Au showroom'}
                          </strong>
                        </li>
                        <li>
                          <span>Destination</span>
                          <strong>{ord.zoneLabel.split('/')[0]}</strong>
                        </li>
                      </ul>

                      <div className="admin-tailor-status-btns">
                        {(
                          [
                            'À retoucher',
                            'En couture (30 min)',
                            'Ourlet terminé',
                          ] as const
                        ).map((hs) => (
                          <button
                            key={hs}
                            type="button"
                            onClick={() => updateOrderHemStatus(ord.orderNumber, hs)}
                            className={`admin-pill ${currentHemStatus === hs ? 'active' : ''}`}
                          >
                            {hs}
                          </button>
                        ))}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. GIFT CARDS & CORPORATE LEADS TAB */}
        {activeTab === 'giftcards' && (
          <div className="admin-two-col">
            {/* Gift Cards Management */}
            <section className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="eyebrow">CARTES DIGITALES AMPA</span>
                  <h2>Cartes Cadeaux ({giftCards.length})</h2>
                </div>
              </div>

              <form onSubmit={handleIssueGiftCard} className="admin-inline-form">
                <select
                  value={newGcAmount}
                  onChange={(e) => setNewGcAmount(Number(e.target.value))}
                >
                  <option value={35000}>35 000 FCFA — Écrin</option>
                  <option value={50000}>50 000 FCFA — Privilège</option>
                  <option value={80000}>80 000 FCFA — Présidentielle</option>
                  <option value={95000}>95 000 FCFA — Le Diplomate</option>
                  <option value={125000}>125 000 FCFA — Gala</option>
                  <option value={150000}>150 000 FCFA — Impériale</option>
                </select>
                <input
                  type="text"
                  placeholder="Bénéficiaire *"
                  required
                  value={newGcRecipient}
                  onChange={(e) => setNewGcRecipient(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="De la part de..."
                  value={newGcSender}
                  onChange={(e) => setNewGcSender(e.target.value)}
                />
                <button type="submit" className="admin-action-btn primary">
                  <Plus size={14} /> Émettre
                </button>
              </form>

              <div className="admin-orders-mini-list">
                {giftCards.map((gc) => (
                  <div key={gc.code} className="admin-mini-order">
                    <div>
                      <strong>
                        <span className="admin-gc-code-pill">{gc.code}</span>
                        {formatPrice(gc.amount)}
                      </strong>
                      <span>
                        {gc.title} · Pour <strong>{gc.recipient}</strong> (De {gc.sender})
                      </span>
                      <small>Émise le {gc.createdAt}</small>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleGiftCardStatus(gc.code)}
                      className={`admin-status-toggle ${gc.status === 'Active' ? 'active' : 'used'}`}
                    >
                      {gc.status === 'Active' ? 'Active · Valider usage' : 'Utilisée'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Corporate & Wedding Cortège Leads */}
            <section className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="eyebrow">MARIAGES &amp; ENTREPRISES</span>
                  <h2>Devis Groupe ({corporateLeads.length})</h2>
                </div>
              </div>

              <div className="admin-orders-mini-list">
                {corporateLeads.map((lead) => (
                  <div key={lead.id} className="admin-mini-order">
                    <div>
                      <span className="eyebrow">{lead.type}</span>
                      <strong>{lead.organization}</strong>
                      <span>
                        {lead.quantity} tenues · {lead.collection}
                      </span>
                      <small>
                        {lead.contactPhone} · Estimation :{' '}
                        <strong>{formatPrice(lead.estimatedTotal)}</strong>
                      </small>
                    </div>
                    <div className="admin-mini-order-right">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateCorporateLeadStatus(
                            lead.id,
                            e.target.value as 'Nouveau' | 'Mesures planifiées' | 'Validé'
                          )
                        }
                        className="admin-compact-select"
                      >
                        <option value="Nouveau">Nouveau</option>
                        <option value="Mesures planifiées">Mesures planifiées</option>
                        <option value="Validé">Validé</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 6. SETTINGS & BACKUP TAB */}
        {activeTab === 'settings' && (
          <div className="admin-two-col">
            <section className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="eyebrow">BOUTIQUE &amp; MOTEURS IA</span>
                  <h2>Showroom &amp; Essayage Virtuel</h2>
                </div>
              </div>

              <div className="admin-settings-list">
                <div className="admin-setting-item">
                  <span>Ligne WhatsApp Commandes</span>
                  <strong>{AMPA_WHATSAPP_DISPLAY}</strong>
                </div>
                <div className="admin-setting-item">
                  <span>Forfait Retouche Ourlet 30 min</span>
                  <strong>3 000 FCFA (Offert dès 80 000 FCFA en Carte Cadeau)</strong>
                </div>
                <div className="admin-setting-item">
                  <span>Moyens de Règlement</span>
                  <strong>Wave · Orange Money · Espèces à la livraison</strong>
                </div>
              </div>

              <form onSubmit={handleSaveAiKeys} className="admin-ai-config-card">
                <div className="admin-ai-config-head">
                  <Wand2 size={16} />
                  <strong>Clés Atelier d&apos;Essayage IA Photoréaliste</strong>
                </div>

                <label className="admin-field">
                  <span>Jeton Hugging Face gratuit (`HF_TOKEN` — Modèle IDM-VTON sans carte bancaire)</span>
                  <input
                    type="password"
                    value={hfTokenInput}
                    onChange={(e) => setHfTokenInput(e.target.value)}
                    placeholder="hf_... (créé gratuitement sur huggingface.co/settings/tokens)"
                  />
                </label>

                <label className="admin-field">
                  <span>Clé Google Gemini Image (`GEMINI_API_KEY` — Requiert Tier 1 Facturation)</span>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="AIza... (optionnel si configurée dans .env.local)"
                  />
                </label>

                <div className="admin-ai-config-actions">
                  <button type="submit" className="admin-action-btn primary">
                    <KeyRound size={14} />
                    <span>{keySavedToast ? 'Clés enregistrées ✓' : 'Enregistrer les clés IA'}</span>
                  </button>
                </div>
              </form>

              <div className="admin-backup-actions">
                <button
                  type="button"
                  className="admin-action-btn secondary"
                  onClick={handleExportData}
                >
                  <Download size={15} />
                  <span>Exporter la sauvegarde (.JSON)</span>
                </button>
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="eyebrow">COURSIERS EXPRESS 24H</span>
                  <h2>Zones &amp; Tarifs Dakar</h2>
                </div>
              </div>

              <div className="admin-orders-mini-list">
                {DAKAR_ZONES.map((z) => (
                  <div key={z.id} className="admin-mini-order">
                    <div>
                      <strong>{z.label}</strong>
                      <span>{z.delay}</span>
                    </div>
                    <span className="admin-status-badge emerald">
                      {z.fee === 0 ? 'Gratuit' : formatPrice(z.fee)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {editingProduct && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow-pill">
                  {isNewProduct ? 'CRÉATION VESTIAIRE' : `ÉDITION · ${editingProduct.reference}`}
                </span>
                <h2>{isNewProduct ? 'Nouveau modèle' : editingProduct.name}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingProduct(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-modal-form">
              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>Nom du modèle *</span>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    placeholder="Ex: Costume Croisé « Le Diplomate » Bleu Roi"
                  />
                </label>

                <label className="admin-field">
                  <span>Référence *</span>
                  <input
                    type="text"
                    required
                    value={editingProduct.reference}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, reference: e.target.value })
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Collection</span>
                  <select
                    value={editingProduct.collectionTag}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        collectionTag: e.target.value as ProductSubcategory,
                      })
                    }
                  >
                    {COLLECTION_OPTIONS.map((c) => (
                      <option key={c.tag} value={c.tag}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-field">
                  <span>Badge éditorial (Optionnel)</span>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, badge: e.target.value })
                    }
                    placeholder="Ex: SIGNATURE AMPA, COLLECTION VIP"
                  />
                </label>

                <label className="admin-field">
                  <span>Prix (FCFA)</span>
                  <input
                    type="number"
                    value={editingProduct.price ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Disponibilité</span>
                  <select
                    value={editingProduct.availability}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        availability: e.target.value as 'available' | 'to-confirm',
                      })
                    }
                  >
                    <option value="available">En stock à Dakar</option>
                    <option value="to-confirm">Sur commande</option>
                  </select>
                </label>

                <label className="admin-field">
                  <span>Drap &amp; Matière</span>
                  <input
                    type="text"
                    value={editingProduct.fabric || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, fabric: e.target.value })
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Tailles (séparées par des virgules)</span>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                  />
                </label>
              </div>

              <label className="admin-field">
                <span>Sous-titre / Coupe</span>
                <input
                  type="text"
                  value={editingProduct.subtitle || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, subtitle: e.target.value })
                  }
                />
              </label>

              <label className="admin-field">
                <span>Description éditoriale</span>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                />
              </label>

              {/* Image Picker & Upload */}
              <div className="admin-field">
                <span>Photographie principale</span>
                <div className="admin-image-picker-row">
                  {STUDIO_IMAGES.map((img) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() =>
                        setEditingProduct({
                          ...editingProduct,
                          image: img.src,
                        })
                      }
                      className={`admin-img-choice ${editingProduct.image === img.src ? 'selected' : ''}`}
                    >
                      <div className="admin-img-choice-thumb">
                        <Image src={img.src} alt={img.label} fill sizes="70px" />
                      </div>
                      <small>{img.label}</small>
                    </button>
                  ))}

                  <label className="admin-upload-tile">
                    <Upload size={18} />
                    <span>Importer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) handleImageFileUpload(f)
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Colors / Swatches Manager */}
              <div className="admin-field">
                <span>Nuances disponibles ({editingProduct.colors.length})</span>
                <div className="admin-colors-list">
                  {editingProduct.colors.map((c, idx) => (
                    <span key={c.name + idx} className="admin-color-chip">
                      <i style={{ backgroundColor: c.hex }} />
                      {c.name}
                      {editingProduct.colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              colors: editingProduct.colors.filter((_, i) => i !== idx),
                            })
                          }
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                <div className="admin-add-color-row">
                  <input
                    type="text"
                    placeholder="Nouvelle nuance (ex: Bleu Minuit)"
                    value={colorNameInput}
                    onChange={(e) => setColorNameInput(e.target.value)}
                  />
                  <input
                    type="color"
                    value={colorHexInput}
                    onChange={(e) => setColorHexInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-action-btn secondary"
                    onClick={() => {
                      if (!colorNameInput.trim()) return
                      setEditingProduct({
                        ...editingProduct,
                        colors: [
                          ...editingProduct.colors,
                          {
                            name: colorNameInput.trim(),
                            hex: colorHexInput,
                            image: editingProduct.image,
                          },
                        ],
                      })
                      setColorNameInput('')
                    }}
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-action-btn secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Annuler
                </button>
                <button type="submit" className="admin-action-btn primary">
                  <CheckCircle2 size={16} />
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL ORDER CREATION MODAL */}
      {newOrderModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-card admin-modal-narrow">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow-pill">VENTE SHOWROOM · WHATSAPP</span>
                <h2>Nouvelle commande</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setNewOrderModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="admin-modal-form">
              <label className="admin-field">
                <span>Nom complet du client *</span>
                <input
                  type="text"
                  required
                  value={moName}
                  onChange={(e) => setMoName(e.target.value)}
                  placeholder="Ex: M. Babacar Ndiaye"
                />
              </label>

              <label className="admin-field">
                <span>Téléphone WhatsApp *</span>
                <input
                  type="tel"
                  required
                  value={moPhone}
                  onChange={(e) => setMoPhone(e.target.value)}
                  placeholder="+221 78..."
                />
              </label>

              <label className="admin-field">
                <span>Modèle choisi</span>
                <select
                  value={moProductSlug}
                  onChange={(e) => setMoProductSlug(e.target.value)}
                >
                  {allProducts.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </label>

              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>Taille</span>
                  <input
                    type="text"
                    value={moSize}
                    onChange={(e) => setMoSize(e.target.value)}
                  />
                </label>

                <label className="admin-field">
                  <span>Règlement</span>
                  <select
                    value={moPayment}
                    onChange={(e) =>
                      setMoPayment(
                        e.target.value as 'Wave' | 'Orange Money' | 'Paiement à la livraison'
                      )
                    }
                  >
                    <option value="Wave">Wave</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="Paiement à la livraison">Paiement à la livraison</option>
                  </select>
                </label>
              </div>

              <label className="admin-field">
                <span>Zone de livraison / Retrait</span>
                <select value={moZone} onChange={(e) => setMoZone(e.target.value)}>
                  {DAKAR_ZONES.map((z) => (
                    <option key={z.id} value={z.label}>
                      {z.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="hem-checkbox-label">
                <input
                  type="checkbox"
                  checked={moHem}
                  onChange={(e) => setMoHem(e.target.checked)}
                />
                <span>Inclure l&apos;Ourlet Express 30 min (+3 000 FCFA)</span>
              </label>

              {moHem && (
                <label className="admin-field">
                  <span>Longueur d&apos;ourlet (cm)</span>
                  <input
                    type="text"
                    value={moHemCm}
                    onChange={(e) => setMoHemCm(e.target.value)}
                  />
                </label>
              )}

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-action-btn secondary"
                  onClick={() => setNewOrderModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="admin-action-btn primary">
                  <CheckCircle2 size={16} />
                  <span>Valider la commande</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
