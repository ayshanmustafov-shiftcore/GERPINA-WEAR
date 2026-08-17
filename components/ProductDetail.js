'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { HeartIcon, TruckIcon } from '@/components/Icons';
import { categoryLabels, getDiscountPercent, isProductAvailable } from '@/data/products';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';

export default function ProductDetail({ product }) {
  const { language, t } = useLanguage();
  const { addToCart, favorites, toggleFavorite, activeAudience } = useStore();
  const availableSizes = useMemo(() => (product.sizes || []).filter((size) => size.available), [product]);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.label || '');
  const [added, setAdded] = useState(false);
  const favorite = favorites.includes(product.id);
  const discount = getDiscountPercent(product.originalPrice, product.price);
  const available = isProductAvailable(product);

  const statusText = available
    ? (language === 'bg' ? 'В наличност' : 'In stock')
    : product.status === 'unavailable'
      ? (language === 'bg' ? 'Временно недостъпен' : 'Unavailable')
      : (language === 'bg' ? 'Изчерпан' : 'Sold out');

  const add = () => {
    if (!available) return;
    if (product.sizes?.length && !selectedSize) return;
    addToCart(product, selectedSize || null);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const shopHref = `/shop?audience=${activeAudience}`;
  const categoryHref = `/shop?audience=${activeAudience}&category=${product.category}`;

  return (
    <main className="product-page page-width">
      <div className="product-breadcrumbs"><Link href={shopHref}>{t.nav.shop}</Link><span>/</span><Link href={categoryHref}>{categoryLabels[product.category]?.[language] || product.category}</Link></div>
      <div className="product-layout">
        <div className="product-gallery">
          <div className="product-main-image">
            {product.image ? (
              <Image src={product.image} alt={product.name[language]} fill priority sizes="(max-width: 850px) 100vw, 58vw" />
            ) : (
              <div className="product-image-placeholder detail-placeholder"><b>GERPINA</b><span>WEAR</span><small>{language === 'bg' ? 'Снимката ще бъде добавена скоро' : 'Photo will be added soon'}</small></div>
            )}
            {!available && <div className="product-sold-overlay"><strong>{statusText}</strong></div>}
          </div>
        </div>
        <aside className="product-info">
          <span className="product-info-brand">{product.brand || 'GERPINA Selection'}</span>
          <h1>{product.name[language]}</h1>
          <p className="product-description">{product.description[language]}</p>
          <div className="detail-price">
            {product.originalPrice && <s>€{product.originalPrice.toFixed(2)}</s>}
            <strong>€{product.price.toFixed(2)}</strong>
            {discount && <b>-{discount}%</b>}
          </div>
          {product.originalPriceEstimated && <span className="estimated-price-note">{language === 'bg' ? 'ДЕМО оригинална цена — предстои потвърждение' : 'DEMO original price — pending confirmation'}</span>}

          <div className="detail-divider" />
          <div className="colour-line"><span>{language === 'bg' ? 'Цвят' : 'Colour'}</span><b>{product.colour[language]}</b></div>
          <div className="colour-swatch"><span /></div>

          <div className="size-title"><span>{language === 'bg' ? 'Размер' : 'Size'}</span><button type="button" disabled>{language === 'bg' ? 'Таблица с размери' : 'Size guide'}</button></div>
          {product.sizes?.length ? (
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  type="button"
                  key={size.label}
                  disabled={!size.available}
                  className={`${selectedSize === size.label ? 'active' : ''} ${!size.available ? 'unavailable' : ''}`}
                  onClick={() => size.available && setSelectedSize(size.label)}
                >
                  {size.label}
                  {!size.available && <small>{language === 'bg' ? 'Изчерпан' : 'Sold out'}</small>}
                </button>
              ))}
            </div>
          ) : <div className="size-placeholder">{language === 'bg' ? 'Размерът не е уточнен.' : 'Size is not specified.'}</div>}

          <div className="product-actions">
            <button className="add-bag" onClick={add} disabled={!available}>{available ? (added ? t.common.added : t.common.addToCart) : statusText}</button>
            <button className={`detail-favorite ${favorite ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label="Favorite"><HeartIcon filled={favorite} /></button>
          </div>

          <div className={`stock-detail ${available ? '' : 'sold'}`}><i />{statusText}</div>
          <div className="delivery-card"><TruckIcon size={25}/><div><b>{language === 'bg' ? 'Доставка с Еконт' : 'Econt delivery'}</b><span>{language === 'bg' ? 'До офис или адрес в България. Изборът на офис ще бъде свързан с Еконт при финалната интеграция.' : 'To an office or address in Bulgaria. Office selection will be connected to Econt in the final integration.'}</span></div></div>
        </aside>
      </div>
    </main>
  );
}
