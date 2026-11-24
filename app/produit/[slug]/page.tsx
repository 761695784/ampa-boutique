import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Shell } from '@/components/ampa/site-shell'
import { ProductDetail } from '@/components/ampa/product-detail'
import { getProduct, getProducts, formatPrice } from '@/lib/products'

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Pièce introuvable' }
  return {
    title: product.name,
    description: `${product.name} (${product.reference}) chez AMPA Boutique à Dakar. ${formatPrice(product.price) ?? 'Prix sur demande'} · Livraison express 24h et retouche ourlet 30 min.`,
    openGraph: {
      title: `${product.name} | AMPA Boutique Dakar`,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const [{ slug }, query, allProducts] = await Promise.all([params, searchParams, getProducts()])
  const product = allProducts.find((p) => p.slug === slug) ?? (await getProduct(slug))
  if (!product) notFound()

  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 3)

  return (
    <Shell>
      <ProductDetail product={product} from={query.from} relatedProducts={relatedProducts} />
    </Shell>
  )
}
