'use client'

import React, { useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sparkles, RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { Product } from '@/lib/products'
import { ProductCard } from './product-card'
import { useStore } from './store-context'

const SUBCOLLECTION_LABELS: Record<string, string> = {
  Toutes: 'Tout',
  croises: 'Croisés',
  'deux-trois-pieces': '2 & 3 Pièces',
  'smokings-gala': 'Smokings',
  'safari-sahelien': 'Safari',
  'manteaux-blazers': 'Manteaux',
  'chemises-accessoires': 'Accessoires',
}

export function CollectionGrid({
  products,
  initialColor = 'Toutes',
  initialSize = 'Toutes',
  initialCut = 'Toutes',
  categoryFilter,
}: {
  products: Product[]
  initialColor?: string
  initialSize?: string
  initialCut?: string
  categoryFilter?: Product['category']
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { sizeProfile, setSizeModalOpen, allProducts } = useStore()

  const activeProducts = useMemo(() => {
    if (allProducts.length === 0) return products
    const cat = categoryFilter ?? products[0]?.category
    return cat ? allProducts.filter((p) => p.category === cat) : allProducts
  }, [allProducts, products, categoryFilter])

  const [color, setColor] = useState(initialColor)
  const [size, setSize] = useState(initialSize)
  const [cut, setCut] = useState(initialCut)
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured')

  const availableCuts = useMemo(() => {
    const tags = Array.from(new Set(activeProducts.map((p) => p.collectionTag).filter(Boolean)))
    return ['Toutes', ...tags]
  }, [activeProducts])

  const colors = [
    'Toutes',
    ...Array.from(new Set(activeProducts.flatMap((p) => p.colors.map((c) => c.name)))),
  ]

  const sizes = [
    'Toutes',
    ...Array.from(new Set(activeProducts.flatMap((p) => p.sizes))).sort((a, b) => {
      const na = Number(a)
      const nb = Number(b)
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
      return a.localeCompare(b)
    }),
  ]

  const filtered = useMemo(() => {
    const list = activeProducts.filter(
      (p) =>
        (cut === 'Toutes' || p.collectionTag === cut) &&
        (color === 'Toutes' || p.colors.some((c) => c.name === color)) &&
        (size === 'Toutes' || p.sizes.includes(size))
    )
    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999))
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    }
    return list
  }, [activeProducts, cut, color, size, sortBy])

  const query = new URLSearchParams()
  if (cut !== 'Toutes') query.set('coupe', cut)
  if (color !== 'Toutes') query.set('couleur', color)
  if (size !== 'Toutes') query.set('taille', size)
  const returnPath = `${pathname}${query.size ? `?${query.toString()}` : ''}`

  function update(nextCut: string, nextColor: string, nextSize: string) {
    setCut(nextCut)
    setColor(nextColor)
    setSize(nextSize)
    const next = new URLSearchParams()
    if (nextCut !== 'Toutes') next.set('coupe', nextCut)
    if (nextColor !== 'Toutes') next.set('couleur', nextColor)
    if (nextSize !== 'Toutes') next.set('taille', nextSize)
    router.replace(`${pathname}${next.size ? `?${next.toString()}` : ''}`, { scroll: false })
  }

  return (
    <>
      {availableCuts.length > 2 && (
        <div className="cut-pills-bar" role="tablist" aria-label="Filtrer par coupe">
          {availableCuts.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => update(tag, color, size)}
              className={`cut-pill-btn ${cut === tag ? 'active' : ''}`}
            >
              {SUBCOLLECTION_LABELS[tag] || tag}
            </button>
          ))}
        </div>
      )}

      <div className="filter-row">
        <div className="filter-left-group">
          <span className="filter-count">
            <SlidersHorizontal size={13} /> <strong>{filtered.length}</strong>{' '}
            {filtered.length > 1 ? 'pièces disponibles' : 'pièce disponible'}
          </span>

          {sizeProfile ? (
            <button
              type="button"
              className={`my-size-filter-btn ${size === sizeProfile.recommendedSize ? 'active' : ''}`}
              onClick={() =>
                update(
                  cut,
                  color,
                  size === sizeProfile.recommendedSize ? 'Toutes' : sizeProfile.recommendedSize
                )
              }
            >
              <Sparkles size={13} />
              <span>Ma taille ({sizeProfile.recommendedSize})</span>
            </button>
          ) : (
            <button
              type="button"
              className="my-size-filter-btn"
              onClick={() => setSizeModalOpen(true)}
            >
              <Sparkles size={13} />
              <span>Ma taille ?</span>
            </button>
          )}
        </div>

        <div className="filter-controls">
          <label>
            Nuance
            <select value={color} onChange={(e) => update(cut, e.target.value, size)}>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Taille
            <select value={size} onChange={(e) => update(cut, color, e.target.value)}>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Trier par
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
            >
              <option value="featured">Sélection Maison AMPA</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </label>

          {(cut !== 'Toutes' || color !== 'Toutes' || size !== 'Toutes') && (
            <button
              type="button"
              className="filter-reset-btn"
              onClick={() => update('Toutes', 'Toutes', 'Toutes')}
            >
              <RotateCcw size={12} /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} from={returnPath} />
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <p>Aucune pièce ne correspond simultanément à ces filtres.</p>
          <button
            type="button"
            className="filter-reset-cta"
            onClick={() => update('Toutes', 'Toutes', 'Toutes')}
          >
            Afficher toutes les pièces de la collection
          </button>
        </div>
      )}
    </>
  )
}
