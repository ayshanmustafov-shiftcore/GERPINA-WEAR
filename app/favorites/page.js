'use client';

import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';
import { useStore } from '@/components/StoreProvider';
import { useLanguage } from '@/components/LanguageProvider';

export default function FavoritesPage() {
  const { favorites } = useStore();
  const { language } = useLanguage();
  const selected = products.filter((product) => favorites.includes(product.id));
  return <main className="favorites-page page-width"><div className="plain-heading"><span>GERPINA</span><h1>{language === 'bg' ? 'Любими' : 'Favorites'}</h1></div>{selected.length ? <ProductGrid products={selected} /> : <div className="empty-state"><h2>{language === 'bg' ? 'Все още няма любими продукти.' : 'No favorites yet.'}</h2><p>{language === 'bg' ? 'Натисни сърцето върху продукт, за да го запазиш тук.' : 'Tap the heart on a product to save it here.'}</p><Link href="/shop">{language === 'bg' ? 'Към магазина' : 'Go to shop'}</Link></div>}</main>;
}
