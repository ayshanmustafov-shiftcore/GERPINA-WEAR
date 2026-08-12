'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { ChevronDown } from '@/components/Icons';
import { audienceLabels, categoryLabels, products } from '@/data/products';
import { useLanguage } from '@/components/LanguageProvider';

export default function ShopExperience({ fixedAudience = null }) {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') || '').toLowerCase();
  const queryCategory = searchParams.get('category');
  const [category, setCategory] = useState(queryCategory || 'all');
  const [sort, setSort] = useState('recommended');
  const [openFilter, setOpenFilter] = useState(null);

  useEffect(() => {
    setCategory(queryCategory || 'all');
  }, [queryCategory]);

  const filtered = useMemo(() => {
    let next = products.filter((product) => !fixedAudience || product.audience === fixedAudience);
    if (q) next = next.filter((product) => `${product.name.bg} ${product.name.en} ${product.category} ${product.colour.bg} ${product.colour.en}`.toLowerCase().includes(q));
    if (category !== 'all') next = next.filter((product) => product.category === category);
    if (sort === 'low') next = [...next].sort((a, b) => a.price - b.price);
    if (sort === 'high') next = [...next].sort((a, b) => b.price - a.price);
    return next;
  }, [fixedAudience, q, category, sort]);

  const availableCategories = Object.entries(categoryLabels).filter(([key]) => products.some((product) => (!fixedAudience || product.audience === fixedAudience) && product.category === key));
  const title = fixedAudience ? audienceLabels[fixedAudience][language] : t.nav.shop;

  return (
    <main className="shop-page">
      <section className="shop-heading page-width">
        <div className="breadcrumbs">GERPINA / {title.toUpperCase()}</div>
        <div className="shop-title-line"><h1>{title}</h1><span>{filtered.length} {t.common.products}</span></div>
        <p>{language === 'bg' ? 'Имената, размерите и цената €10 са временни до финалния Excel инвентар.' : 'Names, sizes and the €10 price are temporary until the final Excel inventory arrives.'}</p>
      </section>

      <section className="filter-strip page-width">
        <div className="filter-dropdown-wrap">
          <button className="filter-button" onClick={() => setOpenFilter(openFilter === 'category' ? null : 'category')}>{language === 'bg' ? 'Категория' : 'Category'}<ChevronDown /></button>
          {openFilter === 'category' && <div className="filter-menu">
            <button className={category === 'all' ? 'active' : ''} onClick={() => { setCategory('all'); setOpenFilter(null); }}>{t.common.all}</button>
            {availableCategories.map(([key, label]) => <button className={category === key ? 'active' : ''} key={key} onClick={() => { setCategory(key); setOpenFilter(null); }}>{label[language]}</button>)}
          </div>}
        </div>
        <button className="filter-button muted" disabled>{language === 'bg' ? 'Размер' : 'Size'}<ChevronDown /></button>
        <button className="filter-button muted" disabled>{language === 'bg' ? 'Цвят' : 'Colour'}<ChevronDown /></button>
        <button className="filter-button muted" disabled>{language === 'bg' ? 'Промоции' : 'Promotions'}<ChevronDown /></button>
        <div className="sort-control">
          <span>{t.common.sort}</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recommended">{t.common.newest}</option>
            <option value="low">{t.common.priceLow}</option>
            <option value="high">{t.common.priceHigh}</option>
          </select>
        </div>
      </section>

      <section className="catalog page-width">
        {q && <div className="search-result-note">{language === 'bg' ? 'Резултати за' : 'Results for'}: <b>“{searchParams.get('q')}”</b></div>}
        {filtered.length ? <ProductGrid products={filtered} /> : <div className="no-results">{language === 'bg' ? 'Няма продукти, които отговарят на филтъра.' : 'No products match this filter.'}</div>}
      </section>
    </main>
  );
}
