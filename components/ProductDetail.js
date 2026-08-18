'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { HeartIcon, TruckIcon } from '@/components/Icons';
import { categoryLabels, getDiscountPercent, isProductAvailable } from '@/data/products';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';
import { getProductSwatches } from '@/lib/productColours';

export default function ProductDetail({ product }) {
  const { language, t } = useLanguage();
  const { addToCart, favorites, toggleFavorite, activeAudience } = useStore();
  const availableSizes = useMemo(() => (product.sizes || []).filter((size) => size.available), [product]);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.label || '');
  const [added, setAdded] = useState(false);
  const favorite = favorites.includes(product.id);
  const discount = getDiscountPercent(product.originalPrice, product.price);
  const available = isProductAvailable(product);
  const colourSwatches = useMemo(() => getProductSwatches(product, language), [product, language]);

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
              <Image src={product.image} alt={`${product.brand} ${product.name[language]}`} fill priority sizes="(max-width: 850px) 100vw, 58vw" />
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
          <div className="detail-price-stack">
            {product.originalPrice && (
              <div className="detail-reference-price">
                <span>{product.originalPriceType === 'reference' ? (language === 'bg' ? 'Референтна цена на марката' : 'Reference brand price') : (language === 'bg' ? 'Цена на марката' : 'Brand price')}</span>
                <s>€{product.originalPrice.toFixed(2)}</s>
              </div>
            )}
            <div className="detail-price">
              <span className="detail-gerpina-label">GERPINA</span>
              <strong>€{product.price.toFixed(2)}</strong>
              {discount && <b>-{discount}%</b>}
            </div>
          </div>
          {product.originalPriceType === 'reference' && <span className="estimated-price-note">{language === 'bg' ? 'Референтна цена на сходен артикул от същата марка; точният SKU не е потвърден.' : 'Reference price for a comparable item from the same brand; the exact SKU has not been verified.'}</span>}

          <div className="detail-divider" />
          <div className="colour-line"><span>{language === 'bg' ? 'Цвят' : 'Colour'}</span><b>{product.colour[language]}</b></div>
          {colourSwatches.length ? (
            <div className="colour-swatches" aria-label={language === 'bg' ? 'Цветове' : 'Colours'}>
              {colourSwatches.map((swatch) => (
                <span
                  key={swatch.key}
                  className={`colour-swatch-box ${swatch.key === 'white' ? 'white-swatch' : ''}`}
                  style={{ background: swatch.css }}
                  title={language === 'bg' ? swatch.bg : swatch.en}
                  aria-label={language === 'bg' ? swatch.bg : swatch.en}
                />
              ))}
            </div>
          ) : (
            <div className="colour-unspecified">{language === 'bg' ? 'Цветът не е уточнен' : 'Colour not specified'}</div>
          )}

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
          <div className="delivery-card"><TruckIcon size={25}/><div><b>{language === 'bg' ? 'Доставка в България' : 'Delivery in Bulgaria'}</b><span>{language === 'bg' ? 'До офис или адрес. Точната цена се показва в checkout.' : 'To an office or address. The exact delivery price is shown at checkout.'}</span></div></div>
        </aside>
      </div>
    </main>
  );
}
