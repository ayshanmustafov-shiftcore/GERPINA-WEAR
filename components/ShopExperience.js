'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { ChevronDown } from '@/components/Icons';
import { audienceLabels, categoryLabels, getDiscountPercent, kidGenderLabels, productMatchesAudience, products } from '@/data/products';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';
import { compareSizes } from '@/lib/sizeSort';

function DropFilter({ label, value, options, onChange, open, onToggle, language }) {
  return (
    <div className="filter-dropdown-wrap">
      <button className={`filter-button ${value !== 'all' ? 'selected' : ''}`} onClick={onToggle}>{label}<ChevronDown /></button>
      {open && (
        <div className="filter-menu scrollable-filter-menu">
          <button className={value === 'all' ? 'active' : ''} onClick={() => onChange('all')}>{language === 'bg' ? 'Всички' : 'All'}</button>
          {options.map((option) => (
            <button className={value === option.value ? 'active' : ''} key={option.value} onClick={() => onChange(option.value)}>{option.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopExperience({ fixedAudience = null }) {
  const { language, t } = useLanguage();
  const { activeAudience, setActiveAudience } = useStore();
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const queryCategory = searchParams.get('category');
  const queryAudience = searchParams.get('audience');
  const saleOnly = searchParams.get('sale') === '1';
  const effectiveAudience = fixedAudience || (['women', 'men', 'kids'].includes(queryAudience) ? queryAudience : activeAudience);
  const [category, setCategory] = useState(queryCategory || 'all');
  const [brand, setBrand] = useState('all');
  const [size, setSize] = useState('all');
  const [colour, setColour] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [kidGender, setKidGender] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [openFilter, setOpenFilter] = useState(null);

  useEffect(() => setCategory(queryCategory || 'all'), [queryCategory]);

  useEffect(() => {
    if (effectiveAudience && effectiveAudience !== activeAudience) setActiveAudience(effectiveAudience);
  }, [effectiveAudience, activeAudience, setActiveAudience]);

  const audienceProducts = useMemo(() => products.filter((product) => productMatchesAudience(product, effectiveAudience)), [effectiveAudience]);

  const availableCategories = useMemo(() => Object.entries(categoryLabels)
    .filter(([key]) => audienceProducts.some((product) => product.category === key))
    .map(([value, label]) => ({ value, label: label[language] })), [audienceProducts, language]);

  const brandOptions = useMemo(() => [...new Set(audienceProducts.map((product) => product.brand).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b)).map((value) => ({ value, label: value })), [audienceProducts]);

  const sizeOptions = useMemo(() => [...new Set(audienceProducts.flatMap((product) => (product.sizes || []).map((item) => item.label)).filter(Boolean))]
    .sort(compareSizes).map((value) => ({ value, label: value })), [audienceProducts]);

  const colourOptions = useMemo(() => {
    const key = language === 'bg' ? 'bg' : 'en';
    const values = new Map();
    audienceProducts.forEach((product) => {
      const raw = product.colour?.[key];
      if (raw && raw !== 'Неуточнен' && raw !== 'Unspecified') values.set(product.colour.bg, raw);
    });
    return [...values.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([value, label]) => ({ value, label }));
  }, [audienceProducts, language]);

  const filtered = useMemo(() => {
    let next = audienceProducts;
    if (saleOnly) next = next.filter((product) => product.originalPrice && product.originalPrice > product.price);
    if (q) next = next.filter((product) => {
      const haystack = `${product.brand} ${product.name.bg} ${product.name.en} ${product.category} ${product.colour.bg} ${product.colour.en} ${(product.sizes || []).map((s) => s.label).join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
    if (category !== 'all') next = next.filter((product) => product.category === category);
    if (brand !== 'all') next = next.filter((product) => product.brand === brand);
    if (size !== 'all') next = next.filter((product) => (product.sizes || []).some((item) => item.label === size));
    if (colour !== 'all') next = next.filter((product) => product.colour.bg === colour);
    if (availability === 'in_stock') next = next.filter((product) => product.status === 'in_stock');
    if (availability === 'sold_out') next = next.filter((product) => product.status !== 'in_stock');
    if (effectiveAudience === 'kids' && kidGender !== 'all') next = next.filter((product) => product.kidGender === kidGender);
    if (sort === 'low') next = [...next].sort((a, b) => a.price - b.price);
    if (sort === 'high') next = [...next].sort((a, b) => b.price - a.price);
    if (sort === 'discount') next = [...next].sort((a, b) => (getDiscountPercent(b.originalPrice, b.price) || 0) - (getDiscountPercent(a.originalPrice, a.price) || 0));
    if (sort === 'recommended') next = [...next].sort((a, b) => (a.status === 'in_stock' ? 0 : 1) - (b.status === 'in_stock' ? 0 : 1));
    return next;
  }, [audienceProducts, q, category, brand, size, colour, availability, effectiveAudience, kidGender, sort, saleOnly]);

  const title = audienceLabels[effectiveAudience]?.[language] || t.nav.shop;
  const closeSet = (setter) => (value) => { setter(value); setOpenFilter(null); };
  const activeCount = [category, brand, size, colour, availability, effectiveAudience === 'kids' ? kidGender : 'all'].filter((v) => v !== 'all').length + (saleOnly ? 1 : 0);

  return (
    <main className="shop-page">
      <section className="shop-heading page-width">
        <div className="breadcrumbs">GERPINA / {title.toUpperCase()}</div>
        <div className="shop-title-line"><h1>{title}</h1><span>{filtered.length} {t.common.products}</span></div>
        <p>{language === 'bg' ? 'Разгледай наличните модели, размери и актуални цени на GERPINA.' : 'Browse available styles, sizes and current GERPINA prices.'}</p>
      </section>

      <section className="filter-strip page-width">
        <DropFilter label={language === 'bg' ? 'Категория' : 'Category'} value={category} options={availableCategories} onChange={closeSet(setCategory)} open={openFilter === 'category'} onToggle={() => setOpenFilter(openFilter === 'category' ? null : 'category')} language={language} />
        <DropFilter label={language === 'bg' ? 'Марка' : 'Brand'} value={brand} options={brandOptions} onChange={closeSet(setBrand)} open={openFilter === 'brand'} onToggle={() => setOpenFilter(openFilter === 'brand' ? null : 'brand')} language={language} />
        <DropFilter label={language === 'bg' ? 'Размер' : 'Size'} value={size} options={sizeOptions} onChange={closeSet(setSize)} open={openFilter === 'size'} onToggle={() => setOpenFilter(openFilter === 'size' ? null : 'size')} language={language} />
        <DropFilter label={language === 'bg' ? 'Цвят' : 'Colour'} value={colour} options={colourOptions} onChange={closeSet(setColour)} open={openFilter === 'colour'} onToggle={() => setOpenFilter(openFilter === 'colour' ? null : 'colour')} language={language} />
        <DropFilter label={language === 'bg' ? 'Наличност' : 'Availability'} value={availability} options={[
          { value: 'in_stock', label: language === 'bg' ? 'В наличност' : 'In stock' },
          { value: 'sold_out', label: language === 'bg' ? 'Изчерпани' : 'Sold out' },
        ]} onChange={closeSet(setAvailability)} open={openFilter === 'availability'} onToggle={() => setOpenFilter(openFilter === 'availability' ? null : 'availability')} language={language} />
        {effectiveAudience === 'kids' && <DropFilter label={language === 'bg' ? 'За' : 'For'} value={kidGender} options={Object.entries(kidGenderLabels).map(([value, item]) => ({ value, label: item[language] }))} onChange={closeSet(setKidGender)} open={openFilter === 'gender'} onToggle={() => setOpenFilter(openFilter === 'gender' ? null : 'gender')} language={language} />}

        <div className="sort-control">
          <span>{t.common.sort}</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="recommended">{t.common.newest}</option>
            <option value="discount">{language === 'bg' ? 'Най-голяма разлика в цената' : 'Biggest price difference'}</option>
            <option value="low">{t.common.priceLow}</option>
            <option value="high">{t.common.priceHigh}</option>
          </select>
        </div>
      </section>

      <section className="catalog page-width">
        {(activeCount > 0 || q) && (
          <div className="active-filter-row">
            <span>{language === 'bg' ? `${activeCount} активни филтъра` : `${activeCount} active filters`}</span>
            <button onClick={() => { setCategory('all'); setBrand('all'); setSize('all'); setColour('all'); setAvailability('all'); setKidGender('all'); }}>{language === 'bg' ? 'Изчисти филтрите' : 'Clear filters'}</button>
          </div>
        )}
        {saleOnly && <div className="search-result-note">{language === 'bg' ? 'Промоции за' : 'Sale selection for'}: <b>{audienceLabels[effectiveAudience]?.[language]}</b></div>}
        {q && <div className="search-result-note">{language === 'bg' ? 'Резултати за' : 'Results for'}: <b>“{searchParams.get('q')}”</b></div>}
        {filtered.length ? <ProductGrid products={filtered} /> : <div className="no-results">{language === 'bg' ? 'Няма продукти, които отговарят на филтъра.' : 'No products match this filter.'}</div>}
      </section>
    </main>
  );
}
