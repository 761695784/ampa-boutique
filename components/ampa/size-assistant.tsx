'use client'

import React, { useState } from 'react'
import { Check, Ruler, Sparkles, Scissors, MessageCircle, RotateCcw } from 'lucide-react'
import {
  computeRecommendedSuitSize,
  AMPA_WHATSAPP_DISPLAY,
  getWhatsAppUrl,
} from '@/lib/products'
import { useStore } from './store-context'

const MORPHOLOGIES = [
  { id: 'Mince', label: 'Mince', desc: 'Silhouette élancée, taille fine' },
  { id: 'Équilibrée', label: 'Équilibrée', desc: 'Proportion standard épaules / taille' },
  { id: 'Épaules larges', label: 'Épaules larges', desc: 'Carrure athlétique ou développée' },
  { id: 'Ventre marqué', label: 'Ventre marqué', desc: 'Besoin d’aisance au boutonnage' },
  { id: 'Forte carrure', label: 'Forte carrure', desc: 'Poitrine et épaules imposantes' },
  { id: 'Très forte carrure', label: 'Très forte carrure', desc: 'Silhouette stature large' },
]

const EASE_ZONES = ['Épaules', 'Poitrine', 'Ventre', 'Bras', 'Taille du pantalon']
const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
const KNOWN_SIZES = ['unknown', '44', '46', '48', '50', '52', '54', '56', '58', '60']

const SIZE_CHART = [
  { size: '44', shirt: 'XS', chest: '86 – 89 cm', waist: '74 – 78 cm', weight: '52 – 60 kg' },
  { size: '46', shirt: 'S', chest: '90 – 93 cm', waist: '78 – 82 cm', weight: '60 – 68 kg' },
  { size: '48', shirt: 'M', chest: '94 – 97 cm', waist: '82 – 86 cm', weight: '68 – 76 kg' },
  { size: '50', shirt: 'L', chest: '98 – 101 cm', waist: '86 – 91 cm', weight: '76 – 85 kg' },
  { size: '52', shirt: 'XL', chest: '102 – 105 cm', waist: '92 – 96 cm', weight: '85 – 94 kg' },
  { size: '54', shirt: 'XL / 2XL', chest: '106 – 109 cm', waist: '97 – 102 cm', weight: '94 – 104 kg' },
  { size: '56', shirt: '2XL', chest: '110 – 114 cm', waist: '103 – 108 cm', weight: '104 – 114 kg' },
  { size: '58', shirt: '3XL', chest: '115 – 119 cm', waist: '109 – 114 cm', weight: '114 – 124 kg' },
  { size: '60', shirt: '3XL+', chest: '120 – 125 cm', waist: '115 – 122 cm', weight: '124+ kg' },
]

export function SizeAssistant({
  onSelectSize,
  compact = false,
}: {
  onSelectSize?: (size: string) => void
  compact?: boolean
}) {
  const { sizeProfile, saveSizeProfile, clearSizeProfile } = useStore()

  const [tab, setTab] = useState<'morpho' | 'tailleur' | 'grille'>('morpho')
  const [knownSize, setKnownSize] = useState( 'unknown')
  const [heightCm, setHeightCm] = useState(sizeProfile?.heightCm ?? 178)
  const [weightKg, setWeightKg] = useState(sizeProfile?.weightKg ?? 78)
  const [shirtSize, setShirtSize] = useState(sizeProfile?.shirtSize ?? 'L')
  const [morphology, setMorphology] = useState(sizeProfile?.morphology ?? 'Équilibrée')
  const [easeZone, setEaseZone] = useState(sizeProfile?.easeZone ?? 'Épaules')
  const [fitPreference, setFitPreference] = useState<'ajustee' | 'classique' | 'confort'>('classique')

  const [chestCm, setChestCm] = useState<string>(sizeProfile?.chestCm ? String(sizeProfile.chestCm) : '')
  const [waistCm, setWaistCm] = useState<string>(sizeProfile?.waistCm ? String(sizeProfile.waistCm) : '')
  const [shoulderCm, setShoulderCm] = useState<string>(sizeProfile?.shoulderCm ? String(sizeProfile.shoulderCm) : '')
  const [inseamCm, setInseamCm] = useState<string>(sizeProfile?.inseamCm ? String(sizeProfile.inseamCm) : '')
  const [savedNotice, setSavedNotice] = useState(false)

  const result = computeRecommendedSuitSize({
    knownSize,
    heightCm,
    weightKg,
    shirtSize,
    morphology,
    easeZone,
    fitPreference,
    chestCm: tab === 'tailleur' && chestCm ? Number(chestCm) : undefined,
    waistCm: tab === 'tailleur' && waistCm ? Number(waistCm) : undefined,
  })

  const handleApplyAndSave = () => {
    saveSizeProfile({
      recommendedSize: result.recommendedSize,
      altSize: result.altSize,
      fitAdvice: result.fitAdvice,
      confidence: result.confidence,
      heightCm,
      weightKg,
      shirtSize,
      morphology,
      easeZone,
      chestCm: chestCm ? Number(chestCm) : undefined,
      waistCm: waistCm ? Number(waistCm) : undefined,
      shoulderCm: shoulderCm ? Number(shoulderCm) : undefined,
      inseamCm: inseamCm ? Number(inseamCm) : undefined,
      updatedAt: new Date().toISOString(),
    })
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 3500)
    if (onSelectSize) {
      onSelectSize(result.recommendedSize)
    }
  }

  const waMorphoMessage = `Bonjour AMPA Boutique Dakar (${AMPA_WHATSAPP_DISPLAY}),\nVoici mon profil de l'Assistant de Taille :\n• Taille recommandée : ${result.recommendedSize}${result.altSize ? ` (ou ${result.altSize})` : ''}\n• Stature : ${heightCm} cm / ${weightKg} kg\n• Chemise habituelle : ${shirtSize}\n• Morphologie : ${morphology} (Aisance : ${easeZone})${chestCm ? `\n• Tour de poitrine : ${chestCm} cm` : ''}${waistCm ? `\n• Tour de taille : ${waistCm} cm` : ''}${inseamCm ? `\n• Longueur ourlet pantalon : ${inseamCm} cm` : ''}\nPouvez-vous me confirmer la coupe idéale ?`
  const waHref = getWhatsAppUrl(waMorphoMessage)

  return (
    <div className="size-assistant-box">
      <div className="sa-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'morpho'}
          className={`sa-tab ${tab === 'morpho' ? 'active' : ''}`}
          onClick={() => setTab('morpho')}
        >
          <Sparkles size={15} />
          <span>1. Morphologie</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'tailleur'}
          className={`sa-tab ${tab === 'tailleur' ? 'active' : ''}`}
          onClick={() => setTab('tailleur')}
        >
          <Scissors size={15} />
          <span>2. Mesures (cm)</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'grille'}
          className={`sa-tab ${tab === 'grille' ? 'active' : ''}`}
          onClick={() => setTab('grille')}
        >
          <Ruler size={15} />
          <span>3. Grille</span>
        </button>
      </div>

      <div className={`sa-grid ${compact ? 'sa-grid-compact' : ''}`}>
        <div className="sa-controls">
          {tab === 'morpho' && (
            <>
              <div className="sa-field">
                <label className="sa-label">Connaissez-vous déjà votre taille de costume ?</label>
                <div className="sa-pills">
                  {KNOWN_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setKnownSize(s)}
                      className={`sa-pill ${knownSize === s ? 'selected' : ''}`}
                    >
                      {s === 'unknown' ? 'Je ne sais pas' : s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sa-sliders-row">
                <div className="sa-slider-box">
                  <div className="sa-slider-head">
                    <span>Votre taille (hauteur)</span>
                    <strong>{heightCm} cm</strong>
                  </div>
                  <input
                    type="range"
                    min={158}
                    max={205}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="sa-range"
                  />
                  <div className="sa-range-labels">
                    <span>158 cm</span>
                    <span>180 cm</span>
                    <span>205 cm</span>
                  </div>
                </div>

                <div className="sa-slider-box">
                  <div className="sa-slider-head">
                    <span>Votre poids approximatif</span>
                    <strong>{weightKg} kg</strong>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={135}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="sa-range"
                  />
                  <div className="sa-range-labels">
                    <span>50 kg</span>
                    <span>85 kg</span>
                    <span>135 kg</span>
                  </div>
                </div>
              </div>

              <div className="sa-field">
                <label className="sa-label">Taille de chemise habituelle (haut du corps)</label>
                <div className="sa-pills">
                  {SHIRT_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShirtSize(s)}
                      className={`sa-pill ${shirtSize === s ? 'selected' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sa-field">
                <label className="sa-label">Votre silhouette / morphologie</label>
                <div className="sa-morpho-grid">
                  {MORPHOLOGIES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMorphology(m.id)}
                      className={`sa-morpho-card ${morphology === m.id ? 'selected' : ''}`}
                    >
                      <strong>{m.label}</strong>
                      <small>{m.desc}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sa-field-split">
                <div className="sa-field">
                  <label className="sa-label">Zone nécessitant le plus d&apos;aisance</label>
                  <div className="sa-pills">
                    {EASE_ZONES.map((z) => (
                      <button
                        key={z}
                        type="button"
                        onClick={() => setEaseZone(z)}
                        className={`sa-pill ${easeZone === z ? 'selected' : ''}`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sa-field">
                  <label className="sa-label">Tombé souhaité</label>
                  <div className="sa-pills">
                    <button
                      type="button"
                      onClick={() => setFitPreference('ajustee')}
                      className={`sa-pill ${fitPreference === 'ajustee' ? 'selected' : ''}`}
                    >
                      Ajusté (Slim)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitPreference('classique')}
                      className={`sa-pill ${fitPreference === 'classique' ? 'selected' : ''}`}
                    >
                      Classique
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitPreference('confort')}
                      className={`sa-pill ${fitPreference === 'confort' ? 'selected' : ''}`}
                    >
                      Confort
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'tailleur' && (
            <div className="sa-tailor-form">
              <p className="sa-tailor-intro">
                Vous connaissez vos mesures au mètre ruban ? Renseignez-les ci-dessous en centimètres pour un calcul tailleur ultra-précis et pour préparer la retouche d&apos;ourlet de votre pantalon.
              </p>
              <div className="sa-tailor-inputs">
                <label className="sa-input-group">
                  <span>Tour de poitrine (cm)</span>
                  <input
                    type="number"
                    placeholder="Ex: 100"
                    min={80}
                    max={140}
                    value={chestCm}
                    onChange={(e) => setChestCm(e.target.value)}
                  />
                  <small>Sous les bras, au plus fort du torse</small>
                </label>
                <label className="sa-input-group">
                  <span>Tour de taille naturelle (cm)</span>
                  <input
                    type="number"
                    placeholder="Ex: 88"
                    min={65}
                    max={135}
                    value={waistCm}
                    onChange={(e) => setWaistCm(e.target.value)}
                  />
                  <small>Au niveau du port habituel du pantalon</small>
                </label>
                <label className="sa-input-group">
                  <span>Carrure d&apos;épaules (cm)</span>
                  <input
                    type="number"
                    placeholder="Ex: 46"
                    min={38}
                    max={60}
                    value={shoulderCm}
                    onChange={(e) => setShoulderCm(e.target.value)}
                  />
                  <small>D&apos;une extrémité d&apos;épaule à l&apos;autre dans le dos</small>
                </label>
                <label className="sa-input-group">
                  <span>Longueur jambe / ourlet souhaité (cm)</span>
                  <input
                    type="number"
                    placeholder="Ex: 102"
                    min={70}
                    max={120}
                    value={inseamCm}
                    onChange={(e) => setInseamCm(e.target.value)}
                  />
                  <small>Pour notre service de retouche ourlet express en 30 min</small>
                </label>
              </div>
            </div>
          )}

          {tab === 'grille' && (
            <div className="sa-chart-wrap">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Taille Costume</th>
                    <th>Équiv. Chemise</th>
                    <th>Tour de Poitrine</th>
                    <th>Tour de Taille</th>
                    <th>Poids Indicatif</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map((row) => (
                    <tr
                      key={row.size}
                      className={row.size === result.recommendedSize ? 'sa-row-active' : ''}
                    >
                      <td>
                        <strong>{row.size}</strong>
                        {row.size === result.recommendedSize && (
                          <span className="sa-badge-inline">Votre taille</span>
                        )}
                      </td>
                      <td>{row.shirt}</td>
                      <td>{row.chest}</td>
                      <td>{row.waist}</td>
                      <td>{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Result Panel */}
        <aside className="sa-result-card">
          <div className="sa-result-header">
            <span className="eyebrow">RECOMMANDATION SUR-MESURE</span>
            <span className="sa-confidence">{result.confidence}% de précision</span>
          </div>

          <div className="sa-size-display">
            <div>
              <small>TAILLE CONSEILLÉE</small>
              <div className="sa-size-number">{result.recommendedSize}</div>
            </div>
            {result.altSize && (
              <div className="sa-alt-size">
                <small>Alternative confort</small>
                <strong>Taille {result.altSize}</strong>
              </div>
            )}
          </div>

          <p className="sa-advice">{result.fitAdvice}</p>

          <div className="sa-tailor-note">
            <Scissors size={16} />
            <p>
              <strong>Pantalon livré sans ourlet :</strong> tous nos pantalons Super 200&apos;s disposent de pattes de serrage latérales et d&apos;une réserve de longueur. Notre maître tailleur partenaire réalise votre ourlet exact en <strong>30 minutes</strong> avant livraison à Dakar.
            </p>
          </div>

          <div className="sa-actions">
            <button type="button" className="sa-primary-btn" onClick={handleApplyAndSave}>
              <Check size={16} />
              <span>
                {savedNotice
                  ? `Taille ${result.recommendedSize} enregistrée !`
                  : `Enregistrer (Taille ${result.recommendedSize})`}
              </span>
            </button>

            <a href={waHref} target="_blank" rel="noreferrer" className="sa-wa-btn">
              <MessageCircle size={15} />
              <span>Conseiller WhatsApp</span>
            </a>

            {sizeProfile && (
              <button type="button" className="sa-reset-btn" onClick={clearSizeProfile}>
                <RotateCcw size={13} />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
