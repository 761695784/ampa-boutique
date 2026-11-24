'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Upload,
  Camera,
  Sparkles,
  Download,
  ShoppingBag,
  MessageCircle,
  RotateCcw,
  CheckCircle2,
  Palette,
  Wand2,
  Loader2,
  KeyRound,
} from 'lucide-react'
import type { Product } from '@/lib/products'
import { formatPrice, getWhatsAppUrl, AMPA_WHATSAPP_DISPLAY } from '@/lib/products'
import { useStore } from './store-context'

type StudioTab = 'draping' | 'ai-tryon'

type SkinAnalysis = {
  toneLabel: string
  undertone: 'warm' | 'neutral' | 'deep-cool'
  warmthScore: number
  luminance: number
  sampleHex: string
}

function analyzePortraitComplexion(img: HTMLImageElement): SkinAnalysis {
  const off = document.createElement('canvas')
  off.width = 120
  off.height = 150
  const ctx = off.getContext('2d')
  if (!ctx) {
    return {
      toneLabel: 'Sous-ton Chaud Équilibré',
      undertone: 'warm',
      warmthScore: 68,
      luminance: 110,
      sampleHex: '#6b4432',
    }
  }
  ctx.drawImage(img, 0, 0, 120, 150)
  // Sample central upper-middle portrait zone (x: 40..80, y: 28..72) where face typically sits
  const data = ctx.getImageData(40, 28, 40, 44).data
  let rSum = 0
  let gSum = 0
  let bSum = 0
  let count = 0

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const lum = r * 0.299 + g * 0.587 + b * 0.114
    // Exclude pure white background walls (>225) and pitch black (<18)
    if (lum > 18 && lum < 222 && r >= b) {
      rSum += r
      gSum += g
      bSum += b
      count++
    }
  }

  if (count < 20) {
    return {
      toneLabel: 'Sous-ton Chaud Doré',
      undertone: 'warm',
      warmthScore: 72,
      luminance: 96,
      sampleHex: '#633f2e',
    }
  }

  const avgR = Math.round(rSum / count)
  const avgG = Math.round(gSum / count)
  const avgB = Math.round(bSum / count)
  const luminance = Math.round(avgR * 0.299 + avgG * 0.587 + avgB * 0.114)
  const warmthScore = Math.max(0, Math.min(100, Math.round((avgR - avgB) * 1.4)))

  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  const sampleHex = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`

  if (luminance < 85) {
    return {
      toneLabel: warmthScore > 42 ? 'Ébène Chaud & Doré' : 'Ébène Profond Intense',
      undertone: warmthScore > 42 ? 'warm' : 'deep-cool',
      warmthScore,
      luminance,
      sampleHex,
    }
  }
  if (luminance < 145) {
    return {
      toneLabel: warmthScore > 48 ? 'Ambre Solaire Chaud' : 'Brun Neutre Équilibré',
      undertone: warmthScore > 48 ? 'warm' : 'neutral',
      warmthScore,
      luminance,
      sampleHex,
    }
  }
  return {
    toneLabel: warmthScore > 40 ? 'Clair Sous-ton Doré' : 'Clair Neutre',
    undertone: warmthScore > 40 ? 'warm' : 'neutral',
    warmthScore,
    luminance,
    sampleHex,
  }
}

function scoreColorHarmony(hex: string, skin: SkinAnalysis | null): { score: number; note: string } {
  const h = hex.toLowerCase()
  const undertone = skin?.undertone ?? 'warm'

  if (h.includes('6e472b') || h.includes('a8794e') || h.includes('c8b496')) {
    return {
      score: undertone === 'warm' ? 98 : 95,
      note: 'Les pigments terreux et solaires (Tabac, Sable, Camel) réchauffent immédiatement votre carnation et illuminent le visage avec une chemise blanche.',
    }
  }
  if (h.includes('4a5240') || h.includes('535644')) {
    return {
      score: undertone === 'deep-cool' ? 97 : 96,
      note: 'Le Vert Olive Impérial crée un accord organique profond et contemporain qui souligne la structure de la mâchoire sans durcir les traits.',
    }
  }
  if (h.includes('141416') || h.includes('18181a')) {
    return {
      score: undertone === 'deep-cool' ? 98 : 95,
      note: 'Le contraste franc Noir Onyx & Col Blanc apporte une autorité de gala souveraine, idéale pour les réceptions du soir et mariages.',
    }
  }
  if (h.includes('202d40') || h.includes('1c2838') || h.includes('172030')) {
    return {
      score: 96,
      note: 'Le Bleu Nuit absorbe la lumière avec sobriété et adoucit les ombres du visage pour une prestance présidentielle irréprochable.',
    }
  }
  return {
    score: 94,
    note: 'Nuance polyvalente au tombé équilibré qui s’accorde harmonieusement avec votre contraste naturel.',
  }
}

export function VirtualTryOn({
  products,
  initialSlug,
  compact = false,
}: {
  products: Product[]
  initialSlug?: string
  compact?: boolean
}) {
  const { addToCart, sizeProfile, setSizeModalOpen } = useStore()

  const wearableProducts = useMemo(
    () => products.filter((p) => p.collectionTag !== 'chemises-accessoires'),
    [products]
  )
  const catalogList = wearableProducts.length > 0 ? wearableProducts : products

  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialSlug && catalogList.some((p) => p.slug === initialSlug)
      ? initialSlug
      : catalogList[0]?.slug || ''
  )
  const [colorIdx, setColorIdx] = useState(0)
  const [studioTab, setStudioTab] = useState<StudioTab>('draping')

  // Client photo & complexion analysis
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null)
  const [userPhotoName, setUserPhotoName] = useState<string>('')
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysis | null>(null)
  const [dragActive, setDragActive] = useState(false)

  // Camera selfie state
  const [cameraOpen, setCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // True Generative AI Try-On state
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResultUrl, setAiResultUrl] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [needsApiKey, setNeedsApiKey] = useState(false)
  const [inlineKeyInput, setInlineKeyInput] = useState('')
  const [savedAdminKey, setSavedAdminKey] = useState('')
  const [savedHfToken, setSavedHfToken] = useState('')

  useEffect(() => {
    try {
      const k = localStorage.getItem('ampa_gemini_key_v1')
      if (k) setSavedAdminKey(k)
      const hf = localStorage.getItem('ampa_hf_token_v1')
      if (hf) setSavedHfToken(hf)
    } catch {}
  }, [])

  useEffect(() => {
    if (initialSlug && catalogList.some((p) => p.slug === initialSlug)) {
      setSelectedSlug(initialSlug)
      setColorIdx(0)
    }
  }, [initialSlug, catalogList])

  const activeProduct =
    catalogList.find((p) => p.slug === selectedSlug) ?? catalogList[0]
  const activeColor = activeProduct?.colors[colorIdx] ?? activeProduct?.colors[0]
  const suitImageSrc = activeColor?.image || activeProduct?.image || '/ampa-hero.png'

  const harmony = useMemo(
    () => scoreColorHarmony(activeColor?.hex || '#4a5240', skinAnalysis),
    [activeColor, skinAnalysis]
  )

  // Compute Top 3 recommended suits for the user's detected complexion
  const topRecommendations = useMemo(() => {
    return [...catalogList]
      .map((prod) => {
        const bestColor = prod.colors[0]
        const h = scoreColorHarmony(bestColor?.hex || '', skinAnalysis)
        return { product: prod, score: h.score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [catalogList, skinAnalysis])

  const processNewPhotoDataUrl = (dataUrl: string, label: string) => {
    setUserPhotoUrl(dataUrl)
    setUserPhotoName(label)
    setAiResultUrl(null)
    setAiError(null)

    const img = new window.Image()
    img.onload = () => {
      setSkinAnalysis(analyzePortraitComplexion(img))
    }
    img.src = dataUrl
  }

  const handleFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        processNewPhotoDataUrl(reader.result, file.name)
      }
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async () => {
    try {
      setCameraOpen(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 900 } },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      setCameraOpen(false)
      alert(
        "Impossible d'accéder à la caméra. Veuillez importer une photo depuis votre appareil."
      )
    }
  }

  const captureSelfie = () => {
    if (!videoRef.current) return
    const v = videoRef.current
    const temp = document.createElement('canvas')
    temp.width = v.videoWidth || 640
    temp.height = v.videoHeight || 800
    const ctx = temp.getContext('2d')
    if (ctx) {
      ctx.drawImage(v, 0, 0, temp.width, temp.height)
      processNewPhotoDataUrl(temp.toDataURL('image/jpeg', 0.92), 'Selfie Caméra')
    }
    stopCamera()
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
    setCameraOpen(false)
  }

  const handleGenerateAiTryOn = async (overrideKey?: string, overrideHf?: string) => {
    if (!userPhotoUrl) {
      setAiError('Importez d’abord votre photo à l’Étape 1 pour lancer l’essayage IA.')
      return
    }
    setStudioTab('ai-tryon')
    setAiLoading(true)
    setAiError(null)
    setNeedsApiKey(false)

    const keyToUse = overrideKey ?? savedAdminKey
    const hfToUse = overrideHf ?? savedHfToken

    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhotoDataUrl: userPhotoUrl,
          suitImagePath: suitImageSrc,
          productName: activeProduct?.name,
          colorName: activeColor?.name,
          fabric: activeProduct?.fabric,
          cut: activeProduct?.cut,
          adminApiKey: keyToUse || undefined,
          hfToken: hfToUse || undefined,
        }),
      })

      const payload = await res.json()
      if (!res.ok) {
        if (payload?.error === 'MISSING_API_KEY' || payload?.error === 'FREE_GPU_QUOTA') {
          setNeedsApiKey(true)
        }
        setAiError(payload?.message || 'La génération IA n’a pas pu aboutir.')
      } else if (payload?.imageDataUrl) {
        setAiResultUrl(payload.imageDataUrl)
      }
    } catch {
      setAiError('Erreur réseau lors de la connexion au moteur d’essayage IA.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSaveInlineApiKey = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inlineKeyInput.trim()
    if (!trimmed) return
    setInlineKeyInput('')
    if (trimmed.startsWith('hf_')) {
      setSavedHfToken(trimmed)
      try {
        localStorage.setItem('ampa_hf_token_v1', trimmed)
      } catch {}
      handleGenerateAiTryOn(undefined, trimmed)
    } else {
      setSavedAdminKey(trimmed)
      try {
        localStorage.setItem('ampa_gemini_key_v1', trimmed)
      } catch {}
      handleGenerateAiTryOn(trimmed, undefined)
    }
  }

  const handleDownloadResult = () => {
    if (aiResultUrl) {
      const a = document.createElement('a')
      a.download = `essayage-ia-ampa-${activeProduct?.slug || 'costume'}.png`
      a.href = aiResultUrl
      a.click()
      return
    }

    // Export clean side-by-side bespoke lookbook card if in Draping mode
    const out = document.createElement('canvas')
    out.width = 960
    out.height = 640
    const ctx = out.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#0e291e'
    ctx.fillRect(0, 0, 960, 640)
    ctx.fillStyle = '#d4a853'
    ctx.font = '700 14px sans-serif'
    ctx.fillText('MAISON AMPA DAKAR · FICHE ACCORD COLORIMÉTRIQUE', 36, 44)
    ctx.fillStyle = '#ffffff'
    ctx.font = '600 26px Georgia, serif'
    ctx.fillText(`${activeProduct?.name || ''} — ${activeColor?.name || ''}`, 36, 80)
    ctx.fillStyle = '#d4dfd9'
    ctx.font = '15px sans-serif'
    ctx.fillText(
      `Compatibilité Teint : ${harmony.score}% · ${formatPrice(activeProduct?.price ?? null) || ''}`,
      36,
      110
    )

    const a = document.createElement('a')
    a.download = `fiche-style-ampa-${activeProduct?.slug || 'costume'}.png`
    a.href = out.toDataURL('image/png')
    a.click()
  }

  const handleAddToCartFromTryOn = () => {
    if (!activeProduct || !activeColor) return
    const chosenSize =
      sizeProfile && activeProduct.sizes.includes(sizeProfile.recommendedSize)
        ? sizeProfile.recommendedSize
        : activeProduct.sizes[Math.floor(activeProduct.sizes.length / 2)] || '50'

    addToCart({
      slug: activeProduct.slug,
      name: activeProduct.name,
      reference: activeProduct.reference,
      image: suitImageSrc,
      colorName: activeColor.name,
      colorHex: activeColor.hex,
      size: chosenSize,
      formulaLabel:
        activeProduct.formulas?.[0]?.label ||
        activeProduct.formula?.[0] ||
        'Pièce seule (Standard)',
      unitPrice: activeProduct.price ?? 95000,
      hemRequested: false,
      quantity: 1,
    })
  }

  const waTryOnMessage = [
    `Bonjour *AMPA Boutique Dakar* (${AMPA_WHATSAPP_DISPLAY}),`,
    `Je viens de tester le modèle *${activeProduct?.name}* (${activeProduct?.reference}) dans l'Atelier d'Essayage :`,
    `• Nuance : ${activeColor?.name} (Accord teint : ${harmony.score}%)`,
    `• Taille : ${sizeProfile ? `${sizeProfile.recommendedSize} (calculée)` : 'À confirmer'}`,
    `• Prix : ${formatPrice(activeProduct?.price ?? null)}`,
    `Est-il disponible pour une livraison ou un essayage à Dakar ?`,
  ].join('\n')

  return (
    <div className={`vto-studio-box ${compact ? 'vto-compact' : ''}`}>
      {/* Studio Mode Tabs */}
      <div className="vto-modes-bar" role="tablist">
        <button
          type="button"
          className={`vto-mode-btn ${studioTab === 'draping' ? 'active' : ''}`}
          onClick={() => setStudioTab('draping')}
        >
          <Palette size={15} />
          <span>1. Miroir Drapé &amp; Accord Teint (Instantané)</span>
        </button>

        <button
          type="button"
          className={`vto-mode-btn ${studioTab === 'ai-tryon' ? 'active' : ''}`}
          onClick={() => setStudioTab('ai-tryon')}
        >
          <Wand2 size={15} />
          <span>2. Essayage IA Photoréaliste ✨</span>
        </button>
      </div>

      <div className="vto-main-grid">
        {/* LEFT COLUMN: Controls (Step 1 Upload + Step 2 Pick Suit) */}
        <div className="vto-controls-col">
          {/* Step 1: Upload Photo */}
          <div className="vto-card-step">
            <div className="vto-step-header">
              <span className="vto-step-badge">ÉTAPE 1</span>
              <h3>Votre portrait</h3>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFileUpload(f)
              }}
            />

            <div
              className={`vto-dropzone ${dragActive ? 'drag-active' : ''} ${userPhotoUrl ? 'has-photo' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                const f = e.dataTransfer.files?.[0]
                if (f) handleFileUpload(f)
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {userPhotoUrl ? (
                <div className="vto-user-mini-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={userPhotoUrl} alt="Votre portrait" />
                </div>
              ) : (
                <Upload size={22} />
              )}
              <div>
                <strong>
                  {userPhotoUrl
                    ? `Photo chargée : ${userPhotoName}`
                    : 'Importer votre photo ou selfie'}
                </strong>
                <span>
                  {skinAnalysis
                    ? `Carnation détectée : ${skinAnalysis.toneLabel}`
                    : 'Analyse instantanée de l’accord couleur & essayage IA'}
                </span>
              </div>
            </div>

            <div className="vto-upload-actions">
              <button
                type="button"
                className="vto-secondary-action"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} /> Choisir une photo
              </button>
              <button
                type="button"
                className="vto-secondary-action"
                onClick={cameraOpen ? stopCamera : startCamera}
              >
                <Camera size={14} /> {cameraOpen ? 'Fermer caméra' : 'Prendre un selfie'}
              </button>
              {userPhotoUrl && (
                <button
                  type="button"
                  className="vto-reset-photo"
                  onClick={() => {
                    setUserPhotoUrl(null)
                    setUserPhotoName('')
                    setSkinAnalysis(null)
                    setAiResultUrl(null)
                  }}
                >
                  <RotateCcw size={13} /> Retirer
                </button>
              )}
            </div>

            {cameraOpen && (
              <div className="vto-camera-box">
                <video ref={videoRef} autoPlay playsInline muted className="vto-video" />
                <button type="button" onClick={captureSelfie} className="vto-capture-btn">
                  <Camera size={16} /> Capturer
                </button>
              </div>
            )}

            {/* Personalized Top 3 Recommendations once photo is uploaded */}
            {userPhotoUrl && skinAnalysis && (
              <div className="vto-top-matches">
                <span className="vto-matches-title">
                  <Sparkles size={13} /> Meilleurs choix AMPA pour votre carnation ({skinAnalysis.toneLabel}) :
                </span>
                <div className="vto-matches-row">
                  {topRecommendations.map((rec, i) => (
                    <button
                      key={rec.product.slug}
                      type="button"
                      onClick={() => {
                        setSelectedSlug(rec.product.slug)
                        setColorIdx(0)
                        setAiResultUrl(null)
                      }}
                      className={`vto-match-chip ${activeProduct?.slug === rec.product.slug ? 'active' : ''}`}
                    >
                      <em>#{i + 1} · {rec.score}%</em>
                      <span>{rec.product.name.replace(/Costume (Croisé |2 Pièces |3 Pièces VIP |Safari )?/, '')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Select Costume & Colorway */}
          <div className="vto-card-step">
            <div className="vto-step-header">
              <span className="vto-step-badge">ÉTAPE 2</span>
              <h3>Modèle &amp; Drap de laine</h3>
            </div>

            <div className="vto-suit-selector-grid">
              {catalogList.map((prod) => {
                const isSelected = prod.slug === activeProduct?.slug
                return (
                  <button
                    key={prod.slug}
                    type="button"
                    onClick={() => {
                      setSelectedSlug(prod.slug)
                      setColorIdx(0)
                      setAiResultUrl(null)
                    }}
                    className={`vto-suit-option ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="vto-suit-thumb">
                      <Image src={prod.image} alt={prod.name} fill sizes="70px" />
                    </div>
                    <div className="vto-suit-meta">
                      <small>{prod.collectionLabel}</small>
                      <strong>{prod.name}</strong>
                      <span>{formatPrice(prod.price)}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {activeProduct && (
              <div className="vto-color-bar">
                <span>Nuances disponibles :</span>
                <div className="vto-color-pills">
                  {activeProduct.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setColorIdx(idx)
                        setAiResultUrl(null)
                      }}
                      className={`vto-color-pill ${colorIdx === idx ? 'selected' : ''}`}
                    >
                      <i style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {userPhotoUrl && (
              <button
                type="button"
                className="vto-generate-ai-cta"
                disabled={aiLoading}
                onClick={() => handleGenerateAiTryOn()}
              >
                {aiLoading ? (
                  <>
                    <Loader2 size={17} className="spin-icon" />
                    <span>Confection de votre essayage IA en cours...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={17} />
                    <span>Générer mon essayage IA réaliste ✨</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Luxury Visual Mirror (Draping Split OR Photorealistic AI Result) */}
        <div className="vto-preview-col">
          {studioTab === 'draping' ? (
            <div className="bespoke-draping-mirror">
              <div className="draping-mirror-grid">
                {/* Left Half: Client Intact Portrait + Tailor Fabric Drape Under Face */}
                <div className="draping-client-side">
                  <div className="draping-client-photo-area">
                    {userPhotoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={userPhotoUrl}
                        alt="Votre portrait"
                        className="draping-client-img"
                      />
                    ) : (
                      <div
                        className="draping-empty-prompt"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera size={28} />
                        <strong>Importez votre photo</strong>
                        <span>
                          Testez l&apos;accord exact de la laine « {activeColor?.name} » sous votre visage, sans déformation.
                        </span>
                      </div>
                    )}
                    <span className="draping-panel-tag">VOTRE VISAGE &amp; DRAPÉ</span>
                  </div>

                  {/* Bespoke Tailor's Fabric Collar Drape Swatch right beneath the portrait */}
                  <div
                    className="tailor-drape-collar"
                    style={{ backgroundColor: activeColor?.hex || '#0e291e' }}
                    title={`Drapé tissu : ${activeColor?.name}`}
                  >
                    <div className="tailor-shirt-v">
                      <div
                        className="tailor-tie-knot"
                        style={{ backgroundColor: activeColor?.hex || '#0e291e' }}
                      />
                    </div>
                    <div className="tailor-drape-caption">
                      <strong>Drapé {activeColor?.name}</strong>
                      <span>{activeProduct?.fabric || "Super 200's · 100% Laine"}</span>
                    </div>
                  </div>
                </div>

                {/* Right Half: Full Studio Silhouette of the Selected Suit */}
                <div className="draping-suit-side">
                  <Image
                    key={suitImageSrc}
                    src={suitImageSrc}
                    alt={activeProduct?.name || 'Costume AMPA'}
                    fill
                    sizes="(max-width: 900px) 50vw, 35vw"
                    className="draping-suit-img"
                  />
                  <span className="draping-panel-tag dark">ALLURE COMPLÈTE</span>
                </div>
              </div>

              <div className="draping-harmony-bar">
                <div className="harmony-left">
                  <Sparkles size={15} />
                  <span>
                    Accord Colorimétrique : <strong>{harmony.score}%</strong>
                  </span>
                </div>
                {userPhotoUrl && (
                  <button
                    type="button"
                    className="switch-to-ai-pill"
                    onClick={() => handleGenerateAiTryOn()}
                  >
                    <Wand2 size={13} /> Voir sur moi en IA ✨
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="ai-tryon-stage">
              {aiLoading ? (
                <div className="ai-stage-loading">
                  <Loader2 size={36} className="spin-icon" />
                  <h3>Atelier IA Maison AMPA en cours...</h3>
                  <p>
                    Ajustement sur-mesure du modèle « {activeProduct?.name} » ({activeColor?.name}) sur votre silhouette...
                  </p>
                </div>
              ) : aiResultUrl ? (
                <div className="ai-stage-result">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={aiResultUrl} alt="Votre essayage IA AMPA" />
                  <span className="vto-canvas-top-badge">
                    <Sparkles size={13} /> Essayage IA Réaliste · {activeProduct?.reference}
                  </span>
                </div>
              ) : (
                <div className="ai-stage-placeholder">
                  <Wand2 size={34} />
                  <h3>Essayage Virtuel IA Photoréaliste</h3>
                  <p>
                    Contrairement à un simple collage, notre moteur IA habille naturellement votre silhouette avec le costume <strong>{activeProduct?.name}</strong> en conservant vos traits, votre posture et l&apos;éclairage studio.
                  </p>

                  {aiError && <div className="ai-error-banner">{aiError}</div>}

                  {needsApiKey && (
                    <form onSubmit={handleSaveInlineApiKey} className="ai-key-inline-box">
                      <label>
                        <KeyRound size={14} /> Jeton gratuit Hugging Face (`hf_...`) ou Clé Gemini Tier 1 :
                      </label>
                      <div className="ai-key-row">
                        <input
                          type="password"
                          placeholder="Collez un jeton gratuit hf_... (huggingface.co/settings/tokens)"
                          value={inlineKeyInput}
                          onChange={(e) => setInlineKeyInput(e.target.value)}
                        />
                        <button type="submit">Activer &amp; Générer</button>
                      </div>
                      <small>
                        100 % gratuit sans carte bancaire via Hugging Face (modèle spécialisé IDM-VTON).
                      </small>
                    </form>
                  )}

                  <button
                    type="button"
                    className="vto-generate-ai-cta"
                    onClick={() =>
                      userPhotoUrl ? handleGenerateAiTryOn() : fileInputRef.current?.click()
                    }
                  >
                    <Wand2 size={17} />
                    <span>
                      {userPhotoUrl
                        ? 'Lancer la génération IA maintenant ✨'
                        : 'Importer d’abord ma photo'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Stylist Verdict & Conversion Card */}
          <div className="vto-verdict-card">
            <div className="vto-verdict-head">
              <div>
                <span className="eyebrow">CONSEIL STYLISTE · MAISON AMPA</span>
                <h4>
                  {activeProduct?.name} — {activeColor?.name}
                </h4>
              </div>
              <span className="vto-score-pill">
                <CheckCircle2 size={14} /> {harmony.score}% Accord
              </span>
            </div>

            <p className="vto-verdict-text">{harmony.note}</p>

            <div className="vto-size-bridge">
              {sizeProfile ? (
                <span>
                  <Sparkles size={13} /> Taille conseillée mémorisée :{' '}
                  <strong>Taille {sizeProfile.recommendedSize}</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setSizeModalOpen(true)}
                  className="vto-calc-size-link"
                >
                  <Sparkles size={13} /> Calculer ma taille exacte (44 à 60) →
                </button>
              )}
            </div>

            <div className="vto-action-buttons">
              <button
                type="button"
                className="vto-cart-btn"
                onClick={handleAddToCartFromTryOn}
              >
                <ShoppingBag size={17} />
                <span>
                  Ajouter au panier ({formatPrice(activeProduct?.price ?? null)})
                </span>
              </button>

              <div className="vto-sub-actions">
                <button
                  type="button"
                  className="vto-download-btn"
                  onClick={handleDownloadResult}
                >
                  <Download size={15} />
                  <span>Télécharger</span>
                </button>

                <a
                  href={getWhatsAppUrl(waTryOnMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="vto-wa-btn"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>

              {activeProduct && (
                <Link
                  href={`/produit/${activeProduct.slug}`}
                  className="vto-view-product-link"
                >
                  Découvrir la fiche de « {activeProduct.name} » ↗
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
