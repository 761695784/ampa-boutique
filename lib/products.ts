export type ProductCategory = 'costumes' | 'manteaux' | 'smokings' | 'safari' | 'accessoires'

export type ProductSubcategory =
  | 'croises'
  | 'deux-trois-pieces'
  | 'smokings-gala'
  | 'safari-sahelien'
  | 'manteaux-blazers'
  | 'chemises-accessoires'

export type ProductFormula = {
  id: string
  label: string
  priceDelta: number
  description: string
}

export type Product = {
  slug: string
  name: string
  subtitle?: string
  reference: string
  category: 'costumes' | 'manteaux'
  collectionTag: ProductSubcategory
  collectionLabel: string
  badge?: string
  fabric?: string
  cut?: string
  image: string
  colors: { name: string; hex: string; image?: string }[]
  sizes: string[]
  price: number | null
  compareAtPrice?: number
  formula?: string[]
  formulas?: ProductFormula[]
  availability: 'to-confirm' | 'available'
  deliveryTime?: string
  description: string
  highlights?: string[]
  care?: string[]
  unhemmedNote?: boolean
  featured?: boolean
  bestSeller?: boolean
}

export const defaultFormulas: ProductFormula[] = [
  {
    id: 'piece-seule',
    label: 'Pièce seule (Standard)',
    priceDelta: 0,
    description: 'Veste et pantalon assortis avec housse de protection griffée AMPA.',
  },
  {
    id: 'pack-elegance',
    label: 'Pack Élégance (+ Chemise & Cravate Soie)',
    priceDelta: 15000,
    description: 'Inclut une chemise blanche en coton égyptien et une cravate en soie assortie.',
  },
  {
    id: 'pack-vip-ceremonie',
    label: 'Pack VIP Cérémonie Complet (+ Coffret Accessoires & Ourlet)',
    priceDelta: 25000,
    description: 'Chemise, coffret cravate + pochette + boutons de manchette et retouche ourlet prioritaire.',
  },
]

const demoProducts: Product[] = [
  {
    slug: 'costume-croise-le-diplomate-olive',
    name: 'Costume Croisé « Le Diplomate » Olive',
    subtitle: 'Coupe croisée 2×1 · Super 200’s 100 % Laine',
    reference: 'AM-101',
    category: 'costumes',
    collectionTag: 'croises',
    collectionLabel: 'Costumes Croisés',
    badge: 'BEST-SELLER',
    fabric: "Super 200's · 100% Laine Vierge",
    cut: 'Coupe Croisée 2×1 Structurée',
    image: '/ampa-hero.png',
    colors: [
      { name: 'Vert Olive Impérial', hex: '#4a5240', image: '/ampa-hero.png' },
      { name: 'Marron Tabac', hex: '#6e472b', image: '/ampa-diplomate.png' },
      { name: 'Bleu Nuit Profond', hex: '#1c2838', image: '/ampa-suit.png' },
    ],
    sizes: ['46', '48', '50', '52', '54', '56', '58'],
    price: 95000,
    compareAtPrice: 115000,
    formula: [
      'Pièce seule (Standard)',
      'Pack Élégance (+ Chemise & Cravate Soie +15 000 FCFA)',
      'Pack VIP Cérémonie Complet (+25 000 FCFA)',
    ],
    formulas: defaultFormulas,
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'Pièce signature du vestiaire AMPA inspirée des grandes maisons sartoriales. Ce costume croisé 2×1 en laine Super 200’s se distingue par ses larges revers en pointe surpiqués et son pantalon à pattes de serrage latérales réglables.',
    highlights: [
      'Tissu Super 200’s 100 % laine respirante adaptée au climat de Dakar',
      'Veste croisée 6 boutons (fermeture 2×1) à larges revers en pointe',
      'Pantalon d’inspiration napolitaine avec pattes de serrage latérales sans ceinture',
      'Livré avec réserve d’ourlet — retouche express en 30 min par notre maître tailleur',
    ],
    care: [
      'Nettoyage à sec uniquement chez un pressing spécialisé',
      'Repassage à la vapeur douce sur cintre large en bois',
      'Conserver dans sa housse respirante AMPA fournie',
    ],
    unhemmedNote: true,
    featured: true,
    bestSeller: true,
  },
  {
    slug: 'costume-croise-le-diplomate-tabac',
    name: 'Costume Croisé « Le Diplomate » Tabac',
    subtitle: 'Coupe croisée 2×1 · Revers en pointe surpiqués',
    reference: 'AM-102',
    category: 'costumes',
    collectionTag: 'croises',
    collectionLabel: 'Costumes Croisés',
    badge: 'COLLECTION VIP',
    fabric: "Super 200's · Laine Mérinos",
    cut: 'Coupe Croisée Napolitaine',
    image: '/ampa-diplomate.png',
    colors: [
      { name: 'Marron Tabac', hex: '#6e472b', image: '/ampa-diplomate.png' },
      { name: 'Vert Olive Impérial', hex: '#4a5240', image: '/ampa-hero.png' },
      { name: 'Anthracite Perle', hex: '#3e4247', image: '/ampa-three-piece.png' },
    ],
    sizes: ['46', '48', '50', '52', '54', '56', '58', '60'],
    price: 95000,
    compareAtPrice: 110000,
    formula: [
      'Pièce seule (Standard)',
      'Pack Élégance (+ Chemise & Cravate Soie +15 000 FCFA)',
      'Pack VIP Cérémonie Complet (+25 000 FCFA)',
    ],
    formulas: defaultFormulas,
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'Une nuance chaude et souveraine qui capte la lumière de Dakar. Confectionné en Super 200’s au tombé fluide et infroissable, Le Diplomate Tabac impose une prestance immédiate lors des conseils d’administration comme des grandes cérémonies.',
    highlights: [
      'Épaules structurées naturelles et entoilage souple haute tenue',
      'Revers en pointe généreux avec boutonnière milanaise',
      'Pantalon taille haute à double pince et pattes de serrage réglables',
      'Ourlet sur-mesure réalisable en 30 minutes avant expédition',
    ],
    unhemmedNote: true,
    featured: true,
    bestSeller: true,
  },
  {
    slug: 'costume-bleu-nuit',
    name: 'Costume 2 Pièces « Le Présidentiel » Bleu Nuit',
    subtitle: 'Coupe droite intemporelle · Super 200’s',
    reference: 'AM-002',
    category: 'costumes',
    collectionTag: 'deux-trois-pieces',
    collectionLabel: 'Costumes 2 & 3 Pièces',
    badge: 'ESSENTIEL',
    fabric: "Super 200's · Laine Froide",
    cut: 'Coupe Ajustée Moderne',
    image: '/ampa-suit.png',
    colors: [
      { name: 'Bleu Nuit', hex: '#202d40', image: '/ampa-suit.png' },
      { name: 'Vert Olive', hex: '#535644', image: '/ampa-hero.png' },
      { name: 'Gris Anthracite', hex: '#3b3e42', image: '/ampa-three-piece.png' },
    ],
    sizes: ['44', '46', '48', '50', '52', '54', '56', '58'],
    price: 80000,
    compareAtPrice: 95000,
    formula: [
      'Pièce seule (Standard)',
      'Pack Élégance (+ Chemise & Cravate Soie +15 000 FCFA)',
      'Pack VIP Cérémonie Complet (+25 000 FCFA)',
    ],
    formulas: defaultFormulas,
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'Une coupe nette et intemporelle, indispensable du vestiaire masculin à Dakar. Sa laine froide Super 200’s assure une fraîcheur remarquable du bureau aux réceptions nocturnes.',
    highlights: [
      'Veste 2 boutons à cran aigu et double fente arrière d’aisance',
      'Doublure respirante demi-dos pour un confort thermique optimal',
      'Pantalon fuselé livré avec réserve d’ourlet',
      'Idéal pour les dirigeants, avocats, cadres et événements officiels',
    ],
    unhemmedNote: true,
    featured: true,
    bestSeller: true,
  },
  {
    slug: 'costume-trois-pieces-vip-anthracite',
    name: 'Costume 3 Pièces VIP « L’Ambassadeur » Gris Perle',
    subtitle: 'Veste, Gilet croisé & Pantalon · Laine Super 200’s',
    reference: 'AM-103',
    category: 'costumes',
    collectionTag: 'deux-trois-pieces',
    collectionLabel: 'Costumes 2 & 3 Pièces',
    badge: 'NOUVEAUTÉ VIP',
    fabric: "Super 200's · Tissage Italien",
    cut: 'Coupe 3 Pièces avec Gilet Croisé',
    image: '/ampa-three-piece.png',
    colors: [
      { name: 'Gris Perle & Anthracite', hex: '#494d52', image: '/ampa-three-piece.png' },
      { name: 'Bleu Nuit', hex: '#202d40', image: '/ampa-suit.png' },
    ],
    sizes: ['46', '48', '50', '52', '54', '56', '58'],
    price: 115000,
    compareAtPrice: 135000,
    formula: [
      'Ensemble 3 pièces seul',
      'Pack Élégance (+ Chemise & Cravate Soie +15 000 FCFA)',
      'Pack VIP Mariage & Gala (+25 000 FCFA)',
    ],
    formulas: defaultFormulas,
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'L’alliance suprême de la distinction. Cet ensemble 3 pièces associe une veste structurée, un gilet croisé à revers châle et un pantalon à pinces pour une allure irréprochable même lorsque vous retirez la veste.',
    highlights: [
      'Ensemble complet 3 pièces : Veste + Gilet croisé 6 boutons + Pantalon',
      'Dos du gilet en soie jacquard avec boucle de cintrage métallique',
      'Tombé lourd et infroissable haute densité',
      'Service retouche prioritaire disponible au showroom de Dakar',
    ],
    unhemmedNote: true,
    featured: true,
  },
  {
    slug: 'smoking-gala-imperial-noir',
    name: 'Smoking de Gala « Le Souverain » Revers Satin',
    subtitle: 'Revers châle en satin de soie · Mariage & Gala',
    reference: 'AM-104',
    category: 'costumes',
    collectionTag: 'smokings-gala',
    collectionLabel: 'Smokings & Cérémonie',
    badge: 'MARIAGE & GALA',
    fabric: 'Laine Turque & Satin de Soie',
    cut: 'Coupe Cérémonie Ajustée',
    image: '/ampa-smoking.png',
    colors: [
      { name: 'Noir Onyx & Satin', hex: '#141416', image: '/ampa-smoking.png' },
      { name: 'Bleu Minuit Gala', hex: '#172030', image: '/ampa-suit.png' },
    ],
    sizes: ['46', '48', '50', '52', '54', '56', '58'],
    price: 125000,
    compareAtPrice: 150000,
    formula: [
      'Smoking 2 pièces (Veste + Pantalon à galon)',
      'Pack Marié Complet (+ Chemise Col Cassé, Nœud Papillon & Boutons +20 000 FCFA)',
    ],
    formulas: [
      {
        id: 'smoking-seul',
        label: 'Smoking 2 pièces (Veste + Pantalon à galon satin)',
        priceDelta: 0,
        description: 'Smoking avec revers châle satiné et pantalon à bande latérale en satin.',
      },
      {
        id: 'pack-marie',
        label: 'Pack Marié & Gala Complet (+ Chemise Smoking, Nœud Papillon & Boutons)',
        priceDelta: 20000,
        description: 'Inclut la chemise à plastron plissé, le nœud papillon en soie, la pochette et les boutons de manchette.',
      },
    ],
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'Pensé pour les mariés, témoins d’honneur et soirées de gala à Dakar. Son revers châle gainé de satin véritable et ses boutons recouverts offrent une présence magnétique sous les projecteurs.',
    highlights: [
      'Revers châle en satin de soie véritable à l’éclat profond',
      'Boutons recouverts de satin et poches passepoilées gansées',
      'Pantalon de smoking avec galon latéral en satin et pattes de serrage',
      'Accompagnement personnalisé pour les cortèges de mariage',
    ],
    unhemmedNote: true,
    featured: true,
    bestSeller: true,
  },
  {
    slug: 'costume-safari-sahelien-sable',
    name: 'Costume Safari « Le Sahélien » Beige Sable',
    subtitle: 'Veste col chemise 4 poches & Pantalon · Super 200’s',
    reference: 'AM-105',
    category: 'manteaux',
    collectionTag: 'safari-sahelien',
    collectionLabel: 'Costumes Safari',
    badge: 'TENDANCE DAKAR',
    fabric: "Super 200's · Laine & Lin Infroissable",
    cut: 'Coupe Safari Afro-Chic Moderne',
    image: '/ampa-safari.png',
    colors: [
      { name: 'Beige Sable Sahélien', hex: '#c8b496', image: '/ampa-safari.png' },
      { name: 'Vert Olive', hex: '#535644', image: '/ampa-hero.png' },
      { name: 'Bleu Nuit', hex: '#202d40', image: '/ampa-suit.png' },
    ],
    sizes: ['46', '48', '50', '52', '54', '56', '58', '60'],
    price: 85000,
    compareAtPrice: 98000,
    formula: [
      'Ensemble Safari 2 pièces (Veste + Pantalon)',
      'Ensemble Safari + Retouche Ourlet Express (+3 000 FCFA)',
    ],
    formulas: [
      {
        id: 'safari-standard',
        label: 'Ensemble Safari 2 pièces (Veste + Pantalon)',
        priceDelta: 0,
        description: 'Veste saharienne structurée et pantalon assorti en Super 200’s infroissable.',
      },
      {
        id: 'safari-ourlet',
        label: 'Ensemble Safari + Ourlet ajusté avant livraison',
        priceDelta: 3000,
        description: 'Ourlet réalisé sur-mesure selon votre longueur de jambe avant remise au livreur.',
      },
    ],
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'L’élégance afro-chic contemporaine par excellence. Ce costume Safari en tissu Super 200’s infroissable conjugue l’autorité d’un tailleur et la liberté d’une veste à col chemise, idéal pour le climat dakarois, les vendredis habillés et les réceptions.',
    highlights: [
      'Veste safari à col chemise structuré et 4 poches à plis Watteau',
      'Tissu Super 200’s respirant et totalement infroissable',
      'Se porte à même la peau, avec un t-shirt fin ou une chemise ouverte',
      'Pantalon assorti à pattes de serrage latérales',
    ],
    unhemmedNote: true,
    featured: true,
    bestSeller: true,
  },
  {
    slug: 'manteau-camel-long',
    name: 'Manteau Long « L’Hivernal » Camel Impérial',
    subtitle: 'Drap de laine & cachemire · Coupe croisée ou droite',
    reference: 'AM-003',
    category: 'manteaux',
    collectionTag: 'manteaux-blazers',
    collectionLabel: 'Manteaux & Blazers',
    badge: 'ÉDITION LIMITÉE',
    fabric: '85% Laine Mérinos · 15% Cachemire',
    cut: 'Ligne Longue Structurée',
    image: '/ampa-coat.png',
    colors: [
      { name: 'Camel Impérial', hex: '#a8794e', image: '/ampa-coat.png' },
      { name: 'Noir Onyx', hex: '#18181a', image: '/ampa-smoking.png' },
      { name: 'Marron Tabac', hex: '#6e472b', image: '/ampa-diplomate.png' },
    ],
    sizes: ['48', '50', '52', '54', '56'],
    price: 110000,
    compareAtPrice: 130000,
    formula: [
      'Manteau seul avec housse de voyage',
      'Pack Voyage Diaspora (+ Col roulé mérinos noir +18 000 FCFA)',
    ],
    formulas: [
      {
        id: 'manteau-seul',
        label: 'Manteau seul avec housse de voyage AMPA',
        priceDelta: 0,
        description: 'Idéal pour les soirées fraîches dakaroises (Almadies / Corniche) et vos déplacements à l’international.',
      },
      {
        id: 'pack-voyage',
        label: 'Pack Voyage (+ Pull Col Roulé Mérinos Noir)',
        priceDelta: 18000,
        description: 'Inclut le pull col roulé fin noir porté sur le lookbook officiel.',
      },
    ],
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'Une ligne longue et souveraine conçue pour les soirées d’alizés sur la Corniche de Dakar comme pour vos voyages d’affaires à Paris, Londres ou New York. Se porte aussi bien par-dessus un costume qu’avec un col roulé.',
    highlights: [
      'Drap de laine vierge et cachemire au toucher velouté',
      'Épaule tailleur conçue pour glisser aisément sur une veste de costume',
      'Fente arrière profonde pour une démarche fluide',
      'Doublure intégrale satinée avec deux poches portefeuille intérieures',
    ],
    unhemmedNote: false,
    featured: true,
  },
  {
    slug: 'costume-olive-coupe-croisee',
    name: 'Costume Croisé Cérémonie Olive & Or',
    subtitle: 'Édition prestige · Boutons dorés ciselés ou ton sur ton',
    reference: 'AM-001',
    category: 'costumes',
    collectionTag: 'croises',
    collectionLabel: 'Costumes Croisés',
    badge: 'SIGNATURE AMPA',
    fabric: "Super 200's · 100% Laine",
    cut: 'Coupe Croisée Ajustée',
    image: '/ampa-hero.png',
    colors: [
      { name: 'Vert Olive', hex: '#535644', image: '/ampa-hero.png' },
      { name: 'Bleu Nuit', hex: '#202d40', image: '/ampa-suit.png' },
    ],
    sizes: ['48', '50', '52', '54', '56'],
    price: 90000,
    compareAtPrice: 105000,
    formula: [
      'Pièce seule (Standard)',
      'Pack Élégance (+ Chemise & Cravate Soie +15 000 FCFA)',
    ],
    formulas: defaultFormulas,
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'Une silhouette affirmée, pensée pour les grandes occasions comme pour les jours qui comptent. Coupe croisée iconique qui souligne la carrure et affine la taille.',
    highlights: [
      'Coupe croisée équilibrée testée sur toutes les morphologies',
      'Tissu laine Super 200’s souple et thermorégulateur',
      'Pantalon assorti livré avec réserve d’ourlet pour un tombé sur-mesure',
    ],
    unhemmedNote: true,
    featured: false,
  },
  {
    slug: 'costume-ceremonie-olive',
    name: 'Costume 2 Pièces « Le Doyen » Vert Sauge',
    subtitle: 'Élégance contemporaine · Réceptions & Cérémonies',
    reference: 'AM-004',
    category: 'costumes',
    collectionTag: 'deux-trois-pieces',
    collectionLabel: 'Costumes 2 & 3 Pièces',
    badge: 'DISPONIBLE',
    fabric: "Super 180's · Laine Vierge",
    cut: 'Coupe Droite Équilibrée',
    image: '/ampa-hero.png',
    colors: [
      { name: 'Vert Olive', hex: '#535644', image: '/ampa-hero.png' },
      { name: 'Marron Tabac', hex: '#6e472b', image: '/ampa-diplomate.png' },
    ],
    sizes: ['48', '50', '52', '54', '56', '58'],
    price: 78000,
    compareAtPrice: 90000,
    formula: [
      'Pièce seule (Standard)',
      'Pack Élégance (+ Chemise & Cravate Soie +15 000 FCFA)',
    ],
    formulas: defaultFormulas,
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'Le ton juste pour célébrer les moments qui rassemblent. Une coupe droite moderne qui offre une aisance exceptionnelle tout au long de la journée.',
    highlights: [
      'Tissu léger infroissable parfait pour le climat sénégalais',
      'Finitions intérieures passepoilées façon tailleur',
      'Retouche ourlet disponible en 30 min avant livraison',
    ],
    unhemmedNote: true,
    featured: false,
  },
  {
    slug: 'coffret-accessoires-souverain-chemise-cravate',
    name: 'Coffret Prestige Chemise & Cravate Tricotée Main',
    subtitle: 'Chemise Coton Égyptien + Cravate Soie + Pochette + Boutons',
    reference: 'AM-201',
    category: 'manteaux',
    collectionTag: 'chemises-accessoires',
    collectionLabel: 'Chemises & Accessoires',
    badge: 'IDÉE CADEAU',
    fabric: '100% Coton Égyptien & Soie Naturelle',
    cut: 'Col Italien Structuré & Cravate Bout Carré',
    image: '/ampa-accessories.png',
    colors: [
      { name: 'Blanc & Or / Onyx', hex: '#d4af37', image: '/ampa-accessories.png' },
      { name: 'Blanc & Bleu Nuit', hex: '#202d40', image: '/ampa-accessories.png' },
      { name: 'Blanc & Vert Impérial', hex: '#4a5240', image: '/ampa-accessories.png' },
    ],
    sizes: ['S (38)', 'M (40)', 'L (42)', 'XL (44)', '2XL (46)', '3XL (48)'],
    price: 35000,
    compareAtPrice: 45000,
    formula: [
      'Coffret Complet (Chemise + Cravate + Pochette + Boutons de manchette)',
      'Coffret + Emballage Cadeau Calligraphié (+2 500 FCFA)',
    ],
    formulas: [
      {
        id: 'coffret-standard',
        label: 'Coffret Complet (Chemise + Cravate + Pochette + Boutons)',
        priceDelta: 0,
        description: 'Présenté dans un écrin rigide aimanté AMPA Dakar.',
      },
      {
        id: 'coffret-cadeau',
        label: 'Coffret + Écrin Cadeau & Carte Calligraphiée',
        priceDelta: 2500,
        description: 'Prêt à offrir avec message personnalisé imprimé sur papier coton.',
      },
    ],
    availability: 'available',
    deliveryTime: 'Livraison Express 24h à Dakar',
    description:
      'L’accord parfait pour sublimer votre costume AMPA ou offrir un présent mémorable. Réunit notre chemise blanche signature en popeline de coton double retors, une cravate en soie tricotée à la main, une pochette coordonnée et une paire de boutons de manchette.',
    highlights: [
      'Chemise 100 % coton égyptien double retors, poignets mousquetaires ou mixtes',
      'Cravate en soie naturelle et pochette roulottée à la main',
      'Paire de boutons de manchette en laiton doré et pierre onyx',
      'Épingle fleur de boutonnière incluse dans le coffret',
    ],
    unhemmedNote: false,
    featured: true,
  },
]

const useApi = process.env.AMPA_API_URL

export async function getProducts(): Promise<Product[]> {
  if (useApi) {
    try {
      const response = await fetch(`${useApi.replace(/\/$/, '')}/api/products`, { next: { revalidate: 60 } })
      if (response.ok) {
        const payload = await response.json()
        const list = (Array.isArray(payload) ? payload : payload.data ?? []).filter(
          (product: Product & { published?: boolean }) => product.published !== false
        )
        if (list.length > 0) return list
      }
    } catch {
      return demoProducts
    }
  }
  return demoProducts
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug)
}

export async function getCollection(category: Product['category']) {
  return (await getProducts()).filter((product) => product.category === category)
}

export async function getCollectionByTag(tag: ProductSubcategory) {
  return (await getProducts()).filter((product) => product.collectionTag === tag)
}

export function formatPrice(price: number | null) {
  return price === null ? null : new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

export type SizeProfile = {
  recommendedSize: string
  altSize?: string
  fitAdvice: string
  confidence: number
  heightCm: number
  weightKg: number
  shirtSize: string
  morphology: string
  easeZone: string
  chestCm?: number
  waistCm?: number
  shoulderCm?: number
  inseamCm?: number
  updatedAt: string
}

export function computeRecommendedSuitSize(input: {
  knownSize: string
  heightCm: number
  weightKg: number
  shirtSize: string
  morphology: string
  easeZone: string
  fitPreference: string
  chestCm?: number
  waistCm?: number
}): { recommendedSize: string; altSize?: string; fitAdvice: string; confidence: number } {
  // If user entered exact chest measurement in cm, European suit size is roughly chestCm / 2
  if (input.chestCm && input.chestCm >= 86 && input.chestCm <= 130) {
    let raw = Math.round(input.chestCm / 2)
    if (raw % 2 !== 0) raw += 1
    if (input.waistCm && input.waistCm > input.chestCm - 8) raw += 2
    const clamped = Math.max(44, Math.min(60, raw))
    return {
      recommendedSize: String(clamped),
      altSize: clamped < 60 ? String(clamped + 2) : undefined,
      fitAdvice:
        'Basé sur votre tour de poitrine tailleur exact. Nos pantalons disposent de pattes de serrage latérales (+/– 4 cm) et d’une réserve d’ourlet.',
      confidence: 98,
    }
  }

  // Otherwise calculate from height, weight, shirtSize, morphology, easeZone, and fitPreference (Moubarak Size Assistant logic)
  const shirtMap: Record<string, number> = {
    XS: 44,
    S: 46,
    M: 48,
    L: 50,
    XL: 52,
    '2XL': 56,
    '3XL': 58,
  }

  let baseFromWeight = 48
  if (input.weightKg < 60) baseFromWeight = 44
  else if (input.weightKg < 68) baseFromWeight = 46
  else if (input.weightKg < 76) baseFromWeight = 48
  else if (input.weightKg < 85) baseFromWeight = 50
  else if (input.weightKg < 94) baseFromWeight = 52
  else if (input.weightKg < 104) baseFromWeight = 54
  else if (input.weightKg < 114) baseFromWeight = 56
  else if (input.weightKg < 124) baseFromWeight = 58
  else baseFromWeight = 60

  // Height adjustment
  if (input.heightCm >= 188 && baseFromWeight < 52) baseFromWeight += 2
  if (input.heightCm <= 168 && baseFromWeight > 48) baseFromWeight -= 1

  const shirtBase = shirtMap[input.shirtSize] ?? baseFromWeight
  let score = (baseFromWeight * 0.6 + shirtBase * 0.4)

  // Morphology adjustments
  if (input.morphology === 'Mince') score -= 1
  if (input.morphology === 'Épaules larges') score += 1.2
  if (input.morphology === 'Ventre marqué') score += 1.5
  if (input.morphology === 'Forte carrure') score += 2
  if (input.morphology === 'Très forte carrure') score += 3.2

  // Ease zone adjustments
  if (input.easeZone === 'Épaules' || input.easeZone === 'Poitrine' || input.easeZone === 'Ventre') {
    score += 0.8
  }

  // Fit preference
  if (input.fitPreference === 'ajustee') score -= 0.6
  if (input.fitPreference === 'confort') score += 1.0

  // Anchor with knownSize if user provided one
  if (input.knownSize && input.knownSize !== 'unknown') {
    const known = Number(input.knownSize)
    if (!Number.isNaN(known)) {
      score = score * 0.55 + known * 0.45
    }
  }

  let evenSize = Math.round(score / 2) * 2
  evenSize = Math.max(44, Math.min(60, evenSize))

  const diff = score - evenSize
  let altSize: string | undefined
  if (diff > 0.5 && evenSize < 60) altSize = String(evenSize + 2)
  else if (diff < -0.5 && evenSize > 44) altSize = String(evenSize - 2)

  let fitAdvice =
    'Coupe équilibrée idéale pour votre carrure. Les pattes de serrage du pantalon ajusteront la taille avec précision.'
  if (input.morphology === 'Épaules larges' || input.easeZone === 'Épaules') {
    fitAdvice =
      'Taille optimisée pour libérer la ligne d’épaules sur nos coupes croisées « Le Diplomate » et vestes Super 200’s.'
  } else if (input.morphology === 'Ventre marqué' || input.easeZone === 'Ventre') {
    fitAdvice =
      'Taille privilégiant l’aisance au boutonnage de la veste tout en conservant une jambe fuselée.'
  }

  return {
    recommendedSize: String(evenSize),
    altSize,
    fitAdvice,
    confidence: 95,
  }
}

export const AMPA_WHATSAPP_RAW =
  process.env.NEXT_PUBLIC_AMPA_WHATSAPP_NUMBER?.replace(/\D/g, '') || '221784211649'
export const AMPA_WHATSAPP_DISPLAY = '+221 78 421 16 49'

export function getWhatsAppUrl(message?: string) {
  const base = `https://wa.me/${AMPA_WHATSAPP_RAW}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const DAKAR_ZONES = [
  { id: 'plateau-medina', label: 'Dakar Plateau / Médina / Fann / Point E', delay: 'Livraison Express sous 3h à 12h', fee: 2000 },
  { id: 'almadies-mermoz', label: 'Almadies / Ngor / Ouakam / Mermoz / Sacré-Cœur', delay: 'Livraison Express sous 6h à 24h', fee: 2500 },
  { id: 'parcelles-vdn', label: 'VDN / Cité Keur Gorgui / Maristes / Parcelles', delay: 'Livraison Express sous 24h', fee: 2500 },
  { id: 'banlieue-pikine', label: 'Pikine / Guédiawaye / Thiaroye / Keur Massar', delay: 'Livraison sous 24h', fee: 3000 },
  { id: 'rufisque-diamniadio', label: 'Rufisque / Diamniadio / Saly / Thiès', delay: 'Livraison sous 24h à 48h', fee: 4500 },
  { id: 'retrait-showroom', label: 'Retrait & Essayage au Showroom Dakar (Avec retouche 30 min)', delay: 'Disponible immédiatement', fee: 0 },
  { id: 'regions-diaspora', label: 'Autres Régions Sénégal & Expédition Internationale (DHL)', delay: 'Expédition sous 48h à 72h', fee: 10000 },
]
