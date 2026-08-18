import { products } from '@/data/products';
import { siteConfig } from '@/data/site';

export default function sitemap() {
  const staticPages = ['', '/women', '/men', '/kids', '/shop', '/about', '/contact', '/delivery-returns', '/terms', '/privacy', '/cookies'];
  const now = new Date();
  return [
    ...staticPages.map((path) => ({
      url: `${siteConfig.domain}${path}`,
      lastModified: now,
      changeFrequency: path === '' || path === '/shop' ? 'daily' : 'weekly',
      priority: path === '' ? 1 : path === '/shop' ? 0.9 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteConfig.domain}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: product.status === 'in_stock' ? 0.8 : 0.4,
    })),
  ];
}
