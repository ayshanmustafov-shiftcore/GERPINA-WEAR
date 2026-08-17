'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@/components/Icons';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';
import { getDiscountPercent, isProductAvailable } from '@/data/products';

export default function ProductCard({ product }) {
  const { language } = useLanguage();
  const { favorites, toggleFavorite } = useStore();
  const favorite = favorites.includes(product.id);
  const discount = getDiscountPercent(product.originalPrice, product.price);
  const available = isProductAvailable(product);

  const statusText = available
    ? (language === 'bg' ? 'В наличност' : 'In stock')
    : product.status === 'unavailable'
      ? (language === 'bg' ? 'Временно недостъпен' : 'Unavailable')
      : (language === 'bg' ? 'Изчерпан' : 'Sold out');

  return (
    <article className={`product-card ${available ? '' : 'is-sold-out'}`}>
      <div className="product-card-image-wrap">
        <Link href={`/product/${product.slug}`} className="product-card-image">
          {product.image ? (
            <Image src={product.image} alt={product.name[language]} fill sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" />
          ) : (
            <div className="product-image-placeholder" aria-label={language === 'bg' ? 'Снимка предстои' : 'Photo coming soon'}>
              <b>GERPINA</b><span>WEAR</span><small>{language === 'bg' ? 'Снимка скоро' : 'Photo coming soon'}</small>
            </div>
          )}
        </Link>
        <button className={`favorite-button ${favorite ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label="Favorite"><HeartIcon filled={favorite} /></button>
        {discount && <span className="discount-chip">-{discount}%</span>}
        {!available && <span className="sold-out-chip">{statusText}</span>}
      </div>
      <div className="product-card-copy">
        <span className="product-brand">{product.brand || 'GERPINA Selection'}</span>
        <Link href={`/product/${product.slug}`} className="product-name">{product.name[language]}</Link>
        <div className="product-price-line">
          {product.originalPrice && (
            <span className="original-price-wrap">
              <s>€{product.originalPrice.toFixed(2)}</s>
              {product.originalPriceEstimated && <em>{language === 'bg' ? 'ДЕМО' : 'DEMO'}</em>}
            </span>
          )}
          <strong>€{product.price.toFixed(2)}</strong>
        </div>
        <span className={`stock-label ${available ? '' : 'sold'}`}><i />{statusText}</span>
      </div>
    </article>
  );
}
