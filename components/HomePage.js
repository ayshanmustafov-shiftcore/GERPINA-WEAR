'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TruckIcon } from '@/components/Icons';
import ProductGrid from '@/components/ProductGrid';
import { products, categoryLabels, getDiscountPercent } from '@/data/products';
import { useLanguage } from '@/components/LanguageProvider';

const categoryTiles = [
  ['dresses', '/images/products/IMG-20260809-WA0019.jpg'],
  ['tops', '/images/products/IMG-20260809-WA0014.jpg'],
  ['trousers', '/images/products/IMG-20260809-WA0007.jpg'],
  ['jackets', '/images/products/IMG-20260809-WA0008.jpg'],
  ['sportswear', '/images/products/IMG-20260809-WA0018.jpg'],
  ['knitwear', '/images/products/IMG-20260809-WA0016.jpg'],
];

export default function HomePage() {
  const { language, t } = useLanguage();
  const heroProduct = products[0];
  const sideProduct = products[5];
  const heroDiscount = getDiscountPercent(heroProduct.originalPrice, heroProduct.price);
  const sideDiscount = getDiscountPercent(sideProduct.originalPrice, sideProduct.price);
  return (
    <main>
      <section className="home-hero page-width">
        <div className="hero-panel hero-copy-panel">
          <span className="hero-kicker">GERPINA WEAR</span>
          <h1>{t.home.heroTitle}</h1>
          <p>{t.home.heroText}</p>
          <div className="hero-buttons">
            <Link href="/women" className="primary-cta">{t.nav.women}<ArrowRight /></Link>
            <Link href="/shop" className="secondary-cta">{t.home.heroCta}</Link>
          </div>
          <small>{language === 'bg' ? 'Демо каталог • Реалният инвентар предстои' : 'Preview catalogue • Real inventory coming next'}</small>
        </div>
        <Link href="/product/zelena-midi-roklya" className="hero-panel hero-image-main">
          <Image src="/images/products/IMG-20260809-WA0000.jpg" alt="Green midi dress" fill priority sizes="(max-width: 760px) 100vw, 40vw" />
          <span className="hero-image-caption"><b>{heroProduct.brand || 'GERPINA Selection'} · -{heroDiscount}%</b><i><s>€{heroProduct.originalPrice.toFixed(2)}</s> €10.00</i></span>
        </Link>
        <Link href="/product/rozov-suitshart-s-polutsip" className="hero-panel hero-image-side">
          <Image src="/images/products/IMG-20260809-WA0005.jpg" alt="Pink sweatshirt" fill priority sizes="(max-width: 760px) 50vw, 23vw" />
          <span className="hero-image-caption compact"><b>-{sideDiscount}%</b><i><s>€{sideProduct.originalPrice.toFixed(2)}</s> €10.00</i></span>
        </Link>
      </section>

      <section className="home-section page-width">
        <div className="section-title-row"><h2>{t.home.categories}</h2><Link href="/shop">{language === 'bg' ? 'Виж всички' : 'View all'} <ArrowRight /></Link></div>
        <div className="category-tiles">
          {categoryTiles.map(([category, image]) => (
            <Link href={`/shop?category=${category}`} className="category-tile" key={category}>
              <div className="category-tile-image"><Image src={image} alt={categoryLabels[category][language]} fill sizes="(max-width: 650px) 33vw, 16vw" /></div>
              <strong>{categoryLabels[category][language]}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="campaign page-width">
        <div className="campaign-copy">
          <span>{language === 'bg' ? 'GERPINA ЦЕНА' : 'GERPINA PRICE'}</span>
          <h2>{t.home.saleTitle}</h2>
          <p>{t.home.saleText}</p>
          <Link href="/shop" className="campaign-link">{language === 'bg' ? 'Разгледай селекцията' : 'Explore the selection'}<ArrowRight /></Link>
        </div>
        <div className="campaign-price">
          <small>{language === 'bg' ? 'Демо пример — временни цени до реалния инвентар' : 'Demo example — temporary prices until the real inventory'}</small>
          <div><s>€59.99</s><strong>€10</strong><b>-83%</b></div>
        </div>
      </section>

      <section className="home-section page-width">
        <div className="section-title-row stacked"><div><h2>{t.home.latest}</h2><p>{t.home.latestText}</p></div><Link href="/shop">{language === 'bg' ? 'Всички продукти' : 'All products'} <ArrowRight /></Link></div>
        <ProductGrid products={products.slice(0, 8)} />
      </section>

      <section className="audience-banners page-width">
        <Link href="/women" className="audience-banner"><Image src="/images/products/IMG-20260809-WA0013.jpg" alt="Women" fill sizes="33vw"/><span>{t.nav.women}<ArrowRight /></span></Link>
        <Link href="/kids" className="audience-banner"><Image src="/images/products/IMG-20260809-WA0001.jpg" alt="Kids" fill sizes="33vw"/><span>{t.nav.kids}<ArrowRight /></span></Link>
        <Link href="/men" className="audience-banner"><Image src="/images/products/IMG-20260809-WA0021.jpg" alt="Men" fill sizes="33vw"/><span>{t.nav.men}<ArrowRight /></span></Link>
      </section>

      <section className="econt-strip">
        <div className="page-width econt-inner"><TruckIcon size={34}/><div><h3>{t.home.econtTitle}</h3><p>{t.home.econtText}</p></div></div>
      </section>
    </main>
  );
}
