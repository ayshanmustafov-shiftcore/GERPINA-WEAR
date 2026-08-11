/**
 * Product catalogue placeholder.
 *
 * When the final Excel inventory arrives, product records will be generated here
 * (or moved to a database/CMS later) using a shape similar to:
 *
 * {
 *   id: 'gw-001',
 *   slug: 'brand-product-name',
 *   name: { bg: '...', en: '...' },
 *   audience: 'women',
 *   category: 'jackets',
 *   brand: '...',
 *   originalPrice: 320,
 *   price: 80,
 *   images: ['/images/products/...'],
 *   variants: [
 *     { colour: 'Black', euSize: '38', letterSize: 'M', quantity: 2 }
 *   ]
 * }
 */

export const products = [];

export function getDiscountPercent(originalPrice, price) {
  if (!originalPrice || !price || price >= originalPrice) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
