'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { HeartIcon, TruckIcon } from '@/components/Icons';
import { categoryLabels, getDiscountPercent } from '@/data/products';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';

export default function ProductDetail({ product }) {
  const { language, t } = useLanguage();
  const { addToCart, favorites, toggleFavorite } = useStore();
  const [added, setAdded] = useState(false);
  const favorite = favorites.includes(product.id);
  const discount = getDiscountPercent(product.originalPrice, product.price);

  const add = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <main className="product-page page-width">
      <div className="product-breadcrumbs"><Link href="/shop">{t.nav.shop}</Link><span>/</span><Link href={`/shop?category=${product.category}`}>{categoryLabels[product.category][language]}</Link></div>
      <div className="product-layout">
        <div className="product-gallery">
          <div className="product-main-image"><Image src={product.image} alt={product.name[language]} fill priority sizes="(max-width: 850px) 100vw, 58vw" /></div>
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
          <span className="vat-note">{language === 'bg' ? 'Демо цена и отстъпка — ще бъдат заменени с реалните данни' : 'Demo price and discount — will be replaced with real inventory data'}</span>

          <div className="detail-divider" />
          <div className="colour-line"><span>{language === 'bg' ? 'Цвят' : 'Colour'}</span><b>{product.colour[language]}</b></div>
          <div className="colour-swatch"><span style={{ background: '#ddd' }} /></div>

          <div className="size-title"><span>{language === 'bg' ? 'Размер' : 'Size'}</span><button disabled>{language === 'bg' ? 'Таблица с размери' : 'Size guide'}</button></div>
          <div className="size-placeholder">{t.common.sizePending}</div>

          <div className="product-actions">
            <button className="add-bag" onClick={add}>{added ? t.common.added : t.common.addToCart}</button>
            <button className={`detail-favorite ${favorite ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label="Favorite"><HeartIcon filled={favorite} /></button>
          </div>

          <div className="stock-detail"><i />{t.common.inStock}</div>
          <div className="delivery-card"><TruckIcon size={25}/><div><b>{language === 'bg' ? 'Доставка с Еконт' : 'Econt delivery'}</b><span>{language === 'bg' ? 'До офис или адрес в България. Финалният checkout предстои.' : 'To an office or address in Bulgaria. Final checkout is coming next.'}</span></div></div>
          <div className="temporary-box"><b>{t.common.temporary}</b><p>{language === 'bg' ? 'Името, цената, размерите и продуктовите данни ще бъдат заменени с информацията от Excel файла.' : 'The name, price, sizes and product data will be replaced with the Excel inventory information.'}</p></div>
        </aside>
      </div>
    </main>
  );
}
