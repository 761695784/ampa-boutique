'use client'

import Link from 'next/link'
import React from 'react'

export function BrandLogo({
  variant = 'header',
  href = '/',
}: {
  variant?: 'header' | 'footer' | 'badge'
  href?: string
}) {
  const isDarkBg = variant === 'footer'
  const primaryColor = isDarkBg ? '#FAF9F5' : '#0E291E'
  const accentColor = '#D4A853'
  const subColor = isDarkBg ? '#D4A853' : '#3E5A4D'

  const svgLogo = (
    <span className={`ampa-comb-logo ampa-comb-${variant}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 304 60"
        fill="none"
        className="ampa-comb-svg"
        role="img"
        aria-label="AMPA — Maison d'Élégance Dakar"
      >
        {/* Sartorial Crest Emblem in Deep Forest Emerald & Prestige Gold */}
        <g transform="translate(2, 4)">
          <path
            d="M26 2L48 15V37L26 50L4 37V15L26 2Z"
            stroke={accentColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M15 16L26 33L37 16"
            stroke={primaryColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 16L11 26L21 31L26 43L31 31L41 26L37 16"
            stroke={primaryColor}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M26 14L29.2 19.2L26 31L22.8 19.2L26 14Z" fill={accentColor} />
          <circle cx="26" cy="9" r="1.8" fill={accentColor} />
        </g>

        <line
          x1="63"
          y1="10"
          x2="63"
          y2="50"
          stroke={accentColor}
          strokeWidth="1.2"
          strokeOpacity="0.6"
        />

        {/* Custom Architectural Wordmark: A M P A */}
        <g fill={primaryColor}>
          <path d="M88 11H91.6L103 37H98.7L89.8 16.2L80.9 37H76.6L88 11Z" />
          <rect x="82.5" y="28" width="14.5" height="2.2" fill={accentColor} />

          <path d="M115 11H118.6L128.5 29L138.4 11H142V37H138.1V18.8L129.8 33.8H127.2L118.9 18.8V37H115V11Z" />

          <path d="M156 11H167.5C173.2 11 177 14.2 177 19.2C177 24.2 173.2 27.4 167.5 27.4H159.9V37H156V11ZM159.9 14.4V24H167.2C170.8 24 173 22.2 173 19.2C173 16.2 170.8 14.4 167.2 14.4H159.9Z" />

          <path d="M195 11H198.6L210 37H205.7L196.8 16.2L187.9 37H183.6L195 11Z" />
          <rect x="189.5" y="28" width="14.5" height="2.2" fill={accentColor} />
        </g>

        <line x1="77" y1="47" x2="93" y2="47" stroke={accentColor} strokeWidth="1.3" />
        <text
          x="99"
          y="50"
          fill={subColor}
          fontFamily="var(--font-jakarta), Inter, sans-serif"
          fontSize="7.6"
          fontWeight="600"
          letterSpacing="2.5"
        >
          MAISON D’ÉLÉGANCE · DAKAR
        </text>
      </svg>
    </span>
  )

  if (!href) return svgLogo

  return (
    <Link href={href} className="wordmark-link" aria-label="AMPA — Maison d'Élégance Dakar, accueil">
      {svgLogo}
    </Link>
  )
}
