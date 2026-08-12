'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@/components/Icons';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';
import { getDiscountPercent } from '@/data/products';

export default function ProductCard({ product }) {
  const { language, t } = useLanguage();
  const { favorites, toggleFavorite } = useStore();
  const favorite = favorites.includes(product.id);
  const discount = getDiscountPercent(product.originalPrice, product.price);

  return (
    <article className="product-card">
      <div className="product-card-image-wrap">
        <Link href={`/product/${product.slug}`} className="product-card-image">
          <Image src={product.image} alt={product.name[language]} fill sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" />
        </Link>
        <button className={`favorite-button ${favorite ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label="Favorite"><HeartIcon filled={favorite} /></button>
        {discount ? <span className="discount-chip">-{discount}%</span> : <span className="preview-chip">€10 {language === 'bg' ? 'ДЕМО' : 'DEMO'}</span>}
      </div>
      <div className="product-card-copy">
        <span className="product-brand">GERPINA Selection</span>
        <Link href={`/product/${product.slug}`} className="product-name">{product.name[language]}</Link>
        <div className="product-price-line">
          {product.originalPrice && <s>€{product.originalPrice.toFixed(2)}</s>}
          <strong>€{product.price.toFixed(2)}</strong>
        </div>
        <span className="stock-label"><i />{t.common.inStock}</span>
      </div>
    </article>
  );
}
