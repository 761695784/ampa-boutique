'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Product, SizeProfile } from '@/lib/products'

export type CartItem = {
  id: string
  slug: string
  name: string
  reference: string
  image: string
  colorName: string
  colorHex: string
  size: string
  formulaLabel: string
  unitPrice: number
  hemRequested: boolean
  hemLengthCm?: string
  quantity: number
}

export type OrderStatus =
  | 'En attente'
  | 'Confirmée · Préparation atelier & retouche'
  | 'Atelier · Ourlet 30 min en cours'
  | 'En cours de livraison Dakar'
  | 'Livrée'
  | 'Annulée'

export type OrderRecord = {
  orderNumber: string
  createdAt: string
  customerName: string
  customerPhone: string
  zoneLabel: string
  paymentMethod: 'Wave' | 'Orange Money' | 'Paiement à la livraison' | 'WhatsApp'
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  hemStatus?: 'Standard (sans ourlet)' | 'À retoucher' | 'En couture (30 min)' | 'Ourlet terminé'
}

export type GiftCardRecord = {
  code: string
  title: string
  amount: number
  recipient: string
  sender: string
  createdAt: string
  status: 'Active' | 'Utilisée'
}

export type CorporateLeadRecord = {
  id: string
  type: 'Corporate Dress Plan' | 'Cortège Mariage & Témoins'
  organization: string
  contactPhone: string
  collection: string
  quantity: number
  estimatedTotal: number
  createdAt: string
  status: 'Nouveau' | 'Mesures planifiées' | 'Validé'
}

const INITIAL_DEMO_ORDERS: OrderRecord[] = [
  {
    orderNumber: 'AMP-2026-8419',
    createdAt: '20 nov. 2026, 10:15',
    customerName: 'Me Cheikh A. Tidiane Sy',
    customerPhone: '+221 77 412 88 90',
    zoneLabel: 'Dakar Plateau / Médina / Fann / Point E',
    paymentMethod: 'Wave',
    items: [
      {
        id: 'demo-1',
        slug: 'costume-croise-le-diplomate-olive',
        name: 'Costume Croisé « Le Diplomate » Olive',
        reference: 'AM-101',
        image: '/ampa-hero.png',
        colorName: 'Vert Olive Impérial',
        colorHex: '#4a5240',
        size: '52',
        formulaLabel: 'Pack Élégance (+ Chemise & Cravate Soie)',
        unitPrice: 113000,
        hemRequested: true,
        hemLengthCm: '104',
        quantity: 1,
      },
    ],
    subtotal: 113000,
    deliveryFee: 2000,
    total: 115000,
    status: 'Atelier · Ourlet 30 min en cours',
    hemStatus: 'En couture (30 min)',
  },
  {
    orderNumber: 'AMP-2026-8415',
    createdAt: '20 nov. 2026, 09:30',
    customerName: 'M. Mouhamadou Lamine Ndiaye',
    customerPhone: '+221 78 305 19 44',
    zoneLabel: 'Almadies / Ngor / Ouakam / Mermoz / Sacré-Cœur',
    paymentMethod: 'Orange Money',
    items: [
      {
        id: 'demo-2',
        slug: 'smoking-gala-imperial-noir',
        name: 'Smoking de Gala « Le Souverain » Revers Satin',
        reference: 'AM-104',
        image: '/ampa-smoking.png',
        colorName: 'Noir Onyx & Satin',
        colorHex: '#141416',
        size: '50',
        formulaLabel: 'Pack Marié & Gala Complet',
        unitPrice: 148000,
        hemRequested: true,
        hemLengthCm: '102',
        quantity: 1,
      },
    ],
    subtotal: 148000,
    deliveryFee: 2500,
    total: 150500,
    status: 'En cours de livraison Dakar',
    hemStatus: 'Ourlet terminé',
  },
  {
    orderNumber: 'AMP-2026-8398',
    createdAt: '19 nov. 2026, 17:45',
    customerName: 'M. Ibrahima Fall',
    customerPhone: '+221 77 654 21 09',
    zoneLabel: 'VDN / Cité Keur Gorgui / Maristes / Parcelles',
    paymentMethod: 'Paiement à la livraison',
    items: [
      {
        id: 'demo-3',
        slug: 'costume-safari-sahelien-sable',
        name: 'Costume Safari « Le Sahélien » Beige Sable',
        reference: 'AM-105',
        image: '/ampa-safari.png',
        colorName: 'Beige Sable Sahélien',
        colorHex: '#c8b496',
        size: '54',
        formulaLabel: 'Ensemble Safari 2 pièces (Veste + Pantalon)',
        unitPrice: 85000,
        hemRequested: false,
        quantity: 1,
      },
    ],
    subtotal: 85000,
    deliveryFee: 2500,
    total: 87500,
    status: 'Livrée',
    hemStatus: 'Standard (sans ourlet)',
  },
]

const INITIAL_GIFT_CARDS: GiftCardRecord[] = [
  {
    code: 'AMPA-95K-7821',
    title: 'Édition Le Diplomate',
    amount: 95000,
    recipient: 'M. Abdoulaye Sy',
    sender: 'Mme Fatou Diop',
    createdAt: '19 nov. 2026',
    status: 'Active',
  },
  {
    code: 'AMPA-125K-4910',
    title: 'Édition Gala & Souverain',
    amount: 125000,
    recipient: 'M. Ousmane Sow',
    sender: 'Cabinet Sahel Audit',
    createdAt: '18 nov. 2026',
    status: 'Active',
  },
]

const INITIAL_CORPORATE_LEADS: CorporateLeadRecord[] = [
  {
    id: 'CORP-101',
    type: 'Corporate Dress Plan',
    organization: 'Cabinet Diop & Associés (Dakar Plateau)',
    contactPhone: '+221 77 811 40 00',
    collection: 'Costumes Croisés « Le Diplomate » (95 000 FCFA)',
    quantity: 8,
    estimatedTotal: 646000,
    createdAt: '19 nov. 2026',
    status: 'Mesures planifiées',
  },
  {
    id: 'CORP-102',
    type: 'Cortège Mariage & Témoins',
    organization: 'Mariage M. & Mme Ndiaye (Almadies)',
    contactPhone: '+221 78 219 55 12',
    collection: 'Smokings de Gala « Le Souverain » (125 000 FCFA)',
    quantity: 6,
    estimatedTotal: 637500,
    createdAt: '20 nov. 2026',
    status: 'Nouveau',
  },
]

type StoreContextType = {
  cart: CartItem[]
  cartCount: number
  cartSubtotal: number
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (item: Omit<CartItem, 'id'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  wishlist: string[]
  toggleWishlist: (slug: string) => void
  sizeProfile: SizeProfile | null
  saveSizeProfile: (profile: SizeProfile) => void
  clearSizeProfile: () => void
  sizeModalOpen: boolean
  setSizeModalOpen: (open: boolean) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  orders: OrderRecord[]
  recordOrder: (order: OrderRecord) => void
  updateOrderStatus: (orderNumber: string, status: OrderStatus) => void
  updateOrderHemStatus: (
    orderNumber: string,
    hemStatus: NonNullable<OrderRecord['hemStatus']>
  ) => void
  deleteOrder: (orderNumber: string) => void
  allProducts: Product[]
  upsertProduct: (product: Product) => void
  deleteProduct: (slug: string) => void
  resetCatalog: () => void
  giftCards: GiftCardRecord[]
  addGiftCard: (gc: GiftCardRecord) => void
  toggleGiftCardStatus: (code: string) => void
  corporateLeads: CorporateLeadRecord[]
  addCorporateLead: (lead: CorporateLeadRecord) => void
  updateCorporateLeadStatus: (id: string, status: CorporateLeadRecord['status']) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({
  children,
  initialProducts = [],
}: {
  children: React.ReactNode
  initialProducts?: Product[]
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [sizeProfile, setSizeProfile] = useState<SizeProfile | null>(null)
  const [sizeModalOpen, setSizeModalOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_DEMO_ORDERS)
  const [giftCards, setGiftCards] = useState<GiftCardRecord[]>(INITIAL_GIFT_CARDS)
  const [corporateLeads, setCorporateLeads] = useState<CorporateLeadRecord[]>(
    INITIAL_CORPORATE_LEADS
  )
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('ampa_products_v1')
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts)
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed)
      }
      const savedCart = localStorage.getItem('ampa_cart_v1')
      if (savedCart) setCart(JSON.parse(savedCart))
      const savedWishlist = localStorage.getItem('ampa_wishlist_v1')
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
      const savedProfile = localStorage.getItem('ampa_size_profile_v1')
      if (savedProfile) setSizeProfile(JSON.parse(savedProfile))
      const savedOrders = localStorage.getItem('ampa_orders_v2')
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders)
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) setOrders(parsedOrders)
      }
      const savedGcs = localStorage.getItem('ampa_giftcards_v1')
      if (savedGcs) setGiftCards(JSON.parse(savedGcs))
      const savedLeads = localStorage.getItem('ampa_corporate_v1')
      if (savedLeads) setCorporateLeads(JSON.parse(savedLeads))
    } catch {
      // ignore storage errors
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('ampa_products_v1', JSON.stringify(products))
    } catch {}
  }, [products, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('ampa_cart_v1', JSON.stringify(cart))
    } catch {}
  }, [cart, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('ampa_wishlist_v1', JSON.stringify(wishlist))
    } catch {}
  }, [wishlist, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      if (sizeProfile) {
        localStorage.setItem('ampa_size_profile_v1', JSON.stringify(sizeProfile))
      } else {
        localStorage.removeItem('ampa_size_profile_v1')
      }
    } catch {}
  }, [sizeProfile, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('ampa_orders_v2', JSON.stringify(orders))
    } catch {}
  }, [orders, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('ampa_giftcards_v1', JSON.stringify(giftCards))
    } catch {}
  }, [giftCards, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('ampa_corporate_v1', JSON.stringify(corporateLeads))
    } catch {}
  }, [corporateLeads, hydrated])

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.slug}-${newItem.colorName}-${newItem.size}-${newItem.formulaLabel}-${newItem.hemRequested ? newItem.hemLengthCm || 'ourlet' : 'std'}`
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        )
      }
      return [...prev, { ...newItem, id }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => setCart([])

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  }

  const saveSizeProfile = (profile: SizeProfile) => setSizeProfile(profile)
  const clearSizeProfile = () => setSizeProfile(null)

  const recordOrder = (order: OrderRecord) => {
    const hasHem = order.items.some((i) => i.hemRequested)
    const enriched: OrderRecord = {
      ...order,
      hemStatus: order.hemStatus ?? (hasHem ? 'À retoucher' : 'Standard (sans ourlet)'),
    }
    setOrders((prev) => [enriched, ...prev])
  }

  const updateOrderStatus = (orderNumber: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o))
    )
  }

  const updateOrderHemStatus = (
    orderNumber: string,
    hemStatus: NonNullable<OrderRecord['hemStatus']>
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === orderNumber ? { ...o, hemStatus } : o))
    )
  }

  const deleteOrder = (orderNumber: string) => {
    setOrders((prev) => prev.filter((o) => o.orderNumber !== orderNumber))
  }

  const upsertProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.slug === product.slug)
      if (exists) {
        return prev.map((p) => (p.slug === product.slug ? product : p))
      }
      return [product, ...prev]
    })
  }

  const deleteProduct = (slug: string) => {
    setProducts((prev) => prev.filter((p) => p.slug !== slug))
  }

  const resetCatalog = () => {
    setProducts(initialProducts)
    try {
      localStorage.removeItem('ampa_products_v1')
    } catch {}
  }

  const addGiftCard = (gc: GiftCardRecord) => {
    setGiftCards((prev) => [gc, ...prev])
  }

  const toggleGiftCardStatus = (code: string) => {
    setGiftCards((prev) =>
      prev.map((g) =>
        g.code === code ? { ...g, status: g.status === 'Active' ? 'Utilisée' : 'Active' } : g
      )
    )
  }

  const addCorporateLead = (lead: CorporateLeadRecord) => {
    setCorporateLeads((prev) => [lead, ...prev])
  }

  const updateCorporateLeadStatus = (id: string, status: CorporateLeadRecord['status']) => {
    setCorporateLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    )
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        sizeProfile,
        saveSizeProfile,
        clearSizeProfile,
        sizeModalOpen,
        setSizeModalOpen,
        searchOpen,
        setSearchOpen,
        orders,
        recordOrder,
        updateOrderStatus,
        updateOrderHemStatus,
        deleteOrder,
        allProducts: products,
        upsertProduct,
        deleteProduct,
        resetCatalog,
        giftCards,
        addGiftCard,
        toggleGiftCardStatus,
        corporateLeads,
        addCorporateLead,
        updateCorporateLeadStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return ctx
}
