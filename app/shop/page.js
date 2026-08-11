'use client';

import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';

const images = ['/images/products/preview-0001.jpg','/images/products/preview-0003.jpg','/images/products/preview-0008.jpg','/images/products/preview-0013.jpg','/images/products/preview-0021.jpg','/images/products/preview-0019.jpg'];

export default function ShopPage() {
  const { language, t } = useLanguage();
  return (
    <main>
      <section className="category-hero shell shop-title-row">
        <div>
          <p className="eyebrow">GERPINA WEAR</p>
          <h1>{t.nav.shop}</h1>
          <p>{language === 'bg' ? 'Каталогът е готов като структура. Реалните продукти, варианти и цени ще бъдат заредени от финалния инвентар.' : 'The catalogue structure is ready. Real products, variants and prices will be loaded from the final inventory.'}</p>
        </div>
        <span className="construction-label">{t.common.underConstruction}</span>
      </section>

      <section className="shop-shell shell">
        <aside className="filter-panel">
          <div className="filter-heading">{language === 'bg' ? 'Филтри' : 'Filters'}</div>
          {[
            language === 'bg' ? 'Категория' : 'Category',
            language === 'bg' ? 'Размер' : 'Size',
            language === 'bg' ? 'Цвят' : 'Colour',
            language === 'bg' ? 'Цена' : 'Price',
            language === 'bg' ? 'Отстъпка' : 'Discount',
            language === 'bg' ? 'Наличност' : 'Availability',
          ].map((filter) => <button key={filter} disabled>{filter}<span>+</span></button>)}
        </aside>

        <div className="catalog-area">
          <div className="catalog-toolbar">
            <span>{language === 'bg' ? 'Примерен изглед на каталога' : 'Catalogue layout preview'}</span>
            <button disabled>{language === 'bg' ? 'Подреди по' : 'Sort by'} ↓</button>
          </div>
          <div className="catalog-grid">
            {images.map((src, index) => (
              <article className="catalog-card" key={src}>
                <div className="catalog-image">
                  <Image src={src} alt="GERPINA Wear preview" fill sizes="(max-width: 700px) 50vw, 25vw" />
                  <span className="discount-badge small">—%</span>
                </div>
                <div className="catalog-copy">
                  <small>GERPINA WEAR</small>
                  <strong>{language === 'bg' ? 'Продуктът се добавя' : 'Product being added'}</strong>
                  <div className="catalog-price"><s>€—</s><b>€—</b></div>
                  <span className="stock-dot">{t.common.inStock}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
