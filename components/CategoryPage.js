'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

const config = {
  women: { bg: 'Жени', en: 'Women', noteBg: 'Дамската селекция се подготвя.', noteEn: 'The women’s selection is being prepared.' },
  kids: { bg: 'Деца', en: 'Kids', noteBg: 'Детската селекция се подготвя.', noteEn: 'The kids’ selection is being prepared.' },
  men: { bg: 'Мъже', en: 'Men', noteBg: 'Мъжката селекция се подготвя.', noteEn: 'The men’s selection is being prepared.' },
};

export default function CategoryPage({ category }) {
  const { language, t } = useLanguage();
  const item = config[category];
  const title = item[language];
  const note = language === 'bg' ? item.noteBg : item.noteEn;

  return (
    <main>
      <section className="category-hero shell">
        <p className="eyebrow">GERPINA WEAR / {title.toUpperCase()}</p>
        <h1>{title}</h1>
        <p>{note} {language === 'bg' ? 'Размери, цветове, наличности и реални отстъпки ще се появят тук след финалния инвентар.' : 'Sizes, colours, availability and real discounts will appear here after the final inventory.'}</p>
      </section>
      <section className="shop-shell shell">
        <aside className="filter-panel">
          <div className="filter-heading">{language === 'bg' ? 'Филтри' : 'Filters'}</div>
          {['Category', 'Size', 'Colour', 'Price', 'Discount'].map((filter) => (
            <button key={filter} disabled>{language === 'bg' ? ({Category:'Категория',Size:'Размер',Colour:'Цвят',Price:'Цена',Discount:'Отстъпка'}[filter]) : filter}<span>+</span></button>
          ))}
        </aside>
        <div className="catalog-pending">
          <span>{t.common.underConstruction}</span>
          <h2>{t.preview.stockPending}</h2>
          <p>{t.preview.body}</p>
          <Link href="/shop" className="text-link">{t.nav.shop} →</Link>
        </div>
      </section>
    </main>
  );
}
