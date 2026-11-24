'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { ArrowUpRight, Camera } from 'lucide-react'
import type { Product } from '@/lib/products'
import { formatPrice } from '@/lib/products'

export function ProductCard({ product, from }: { product: Product; from?: string }) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)

  const activeColor = product.colors[selectedColorIdx] ?? product.colors[0]
  const displayImage = activeColor?.image || product.image
  const productUrl = `/produit/${product.slug}${from ? `?from=${encodeURIComponent(from)}` : ''}`

  return (
    <article className="product-card">
      <div className="product-photo-wrapper">
        <Link href={productUrl} className="product-photo">
          <Image
            src={displayImage}
            alt={`${product.name} — ${activeColor?.name ?? ''}`}
            fill
            sizes="(max-width: 700px) 50vw, 33vw"
          />
          {product.badge && (
            <div className="product-badges-top">
              <span className="product-badge-pill">{product.badge}</span>
            </div>
          )}
        </Link>

        {product.collectionTag !== 'chemises-accessoires' && (
          <Link
            href={`/essayage-virtuel?modele=${encodeURIComponent(product.slug)}`}
            className="editorial-tryon-pill"
            title="Essayer ce modèle sur votre photo"
          >
            <Camera size={13} />
            <span>Essayer</span>
          </Link>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-meta-top">
          <span className="product-collection-tag">{product.collectionLabel}</span>
          <div className="swatches" role="group" aria-label="Choisir une nuance">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                type="button"
                title={color.name}
                aria-label={color.name}
                onClick={() => setSelectedColorIdx(idx)}
                className={`swatch-btn ${selectedColorIdx === idx ? 'active' : ''}`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        <Link href={productUrl} className="product-name">
          {product.name}
        </Link>

        <div className="product-editorial-footer">
          <span className="product-price">{formatPrice(product.price) ?? 'Sur demande'}</span>
          <Link href={productUrl} className="product-discover-link">
            <span>Découvrir</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}
