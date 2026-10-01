import { notFound, permanentRedirect } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import { getProductBySlug, inventoryProducts, isProductAvailable } from '@/data/products';
import { siteConfig } from '@/data/site';

export function generateStaticParams() {
  return inventoryProducts.filter(isProductAvailable).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.brand} ${product.name.bg}`;
  const description = `${product.description.bg} GERPINA цена €${product.price.toFixed(2)}.`;
  const url = `${siteConfig.domain}/product/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | GERPINA Wear`,
      description,
      url,
      siteName: 'GERPINA Wear',
      locale: 'bg_BG',
      type: 'website',
      images: product.image ? [{ url: product.image, alt: title }] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  if (slug !== product.slug) permanentRedirect(`/product/${product.slug}`);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.name.bg}`,
    description: product.description.bg,
    sku: product.id,
    brand: { '@type': 'Brand', name: product.brand },
    image: product.image ? [`${siteConfig.domain}${product.image}`] : undefined,
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.domain}/product/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: isProductAvailable(product)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'GERPINA WEAR EOOD' },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ProductDetail product={product} />
    </>
  );
}
