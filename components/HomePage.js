'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TruckIcon } from '@/components/Icons';
import ProductGrid from '@/components/ProductGrid';
import { products, categoryLabels, getDiscountPercent, isProductAvailable, productMatchesAudience } from '@/data/products';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';

const categoryKeys = ['dresses', 'tops', 'trousers', 'jackets', 'sportswear', 'skirts'];

function PictureOrPlaceholder({ product, alt, language, className = '' }) {
  if (product?.image) return <Image src={product.image} alt={alt} fill sizes="(max-width: 760px) 100vw, 40vw" />;
  return <div className={`product-image-placeholder ${className}`}><b>GERPINA</b><span>WEAR</span><small>{language === 'bg' ? 'Снимка скоро' : 'Photo coming soon'}</small></div>;
}

export default function HomePage() {
  const { language, t } = useLanguage();
  const { activeAudience, setActiveAudience } = useStore();
  const scopedProducts = products.filter((product) => productMatchesAudience(product, activeAudience));
  const imageProducts = scopedProducts.filter((product) => product.image && isProductAvailable(product));
  const heroProduct = imageProducts.find((product) => product.brand === 'Lauren Ralph Lauren') || imageProducts[0];
  const sideProduct = imageProducts.find((product) => product.id !== heroProduct?.id && getDiscountPercent(product.originalPrice, product.price) >= 50) || imageProducts[1];
  const heroDiscount = heroProduct ? getDiscountPercent(heroProduct.originalPrice, heroProduct.price) : null;
  const sideDiscount = sideProduct ? getDiscountPercent(sideProduct.originalPrice, sideProduct.price) : null;
  const latestProducts = [...scopedProducts].sort((a, b) => (isProductAvailable(a) ? 0 : 1) - (isProductAvailable(b) ? 0 : 1)).slice(0, 8);
  const scopedShopHref = (params = {}) => {
    const search = new URLSearchParams({ audience: activeAudience });
    Object.entries(params).forEach(([key, value]) => value && search.set(key, value));
    return `/shop?${search.toString()}`;
  };

  const switchAudience = (audience) => setActiveAudience(audience);

  return (
    <main>
      <section className="home-hero page-width">
        <div className="hero-panel hero-copy-panel">
          <span className="hero-kicker">GERPINA WEAR</span>
          <h1>{t.home.heroTitle}</h1>
          <p>{t.home.heroText}</p>
          <div className="hero-buttons">
            <Link href={`/${activeAudience}`} className="primary-cta">{activeAudience === 'women' ? t.nav.women : activeAudience === 'men' ? t.nav.men : t.nav.kids}<ArrowRight /></Link>
            <Link href={scopedShopHref()} className="secondary-cta">{t.home.heroCta}</Link>
          </div>
          <small>{language === 'bg' ? 'Реални продажни цени • Снимките се допълват' : 'Actual selling prices • Photos are being added'}</small>
        </div>

        {heroProduct && (
          <Link href={`/product/${heroProduct.slug}`} className="hero-panel hero-image-main">
            <PictureOrPlaceholder product={heroProduct} alt={heroProduct.name[language]} language={language} />
            <span className="hero-image-caption">
              <b>{heroProduct.brand}{heroDiscount ? ` · -${heroDiscount}%` : ''}</b>
              <i><s>€{heroProduct.originalPrice.toFixed(2)}</s> €{heroProduct.price.toFixed(2)}</i>
            </span>
          </Link>
        )}

        {sideProduct && (
          <Link href={`/product/${sideProduct.slug}`} className="hero-panel hero-image-side">
            <PictureOrPlaceholder product={sideProduct} alt={sideProduct.name[language]} language={language} />
            <span className="hero-image-caption compact"><b>{sideDiscount ? `-${sideDiscount}%` : sideProduct.brand}</b><i><s>€{sideProduct.originalPrice.toFixed(2)}</s> €{sideProduct.price.toFixed(2)}</i></span>
          </Link>
        )}
      </section>

      <section className="home-section page-width">
        <div className="section-title-row"><h2>{t.home.categories}</h2><Link href={scopedShopHref()}>{language === 'bg' ? 'Виж всички' : 'View all'} <ArrowRight /></Link></div>
        <div className="category-tiles">
          {categoryKeys.map((category) => {
            const visual = imageProducts.find((product) => product.category === category);
            return (
              <Link href={scopedShopHref({ category })} className="category-tile" key={category}>
                <div className="category-tile-image">
                  {visual?.image ? <Image src={visual.image} alt={categoryLabels[category][language]} fill sizes="(max-width: 650px) 33vw, 16vw" /> : <div className="product-image-placeholder compact-placeholder"><b>GERPINA</b><small>{language === 'bg' ? 'Снимка скоро' : 'Photo soon'}</small></div>}
                </div>
                <strong>{categoryLabels[category][language]}</strong>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="campaign page-width">
        <div className="campaign-copy">
          <span>{language === 'bg' ? 'GERPINA ЦЕНА' : 'GERPINA PRICE'}</span>
          <h2>{t.home.saleTitle}</h2>
          <p>{t.home.saleText}</p>
          <Link href={scopedShopHref({ sale: '1' })} className="campaign-link">{language === 'bg' ? 'Разгледай намаленията' : 'Explore the reductions'}<ArrowRight /></Link>
        </div>
        {heroProduct && (
          <div className="campaign-price">
            <small>{heroProduct.originalPriceEstimated ? (language === 'bg' ? 'ДЕМО оригинална цена' : 'DEMO original price') : (language === 'bg' ? 'Цена от инвентара' : 'Inventory price')}</small>
            <div><s>€{heroProduct.originalPrice.toFixed(2)}</s><strong>€{heroProduct.price.toFixed(2)}</strong>{heroDiscount && <b>-{heroDiscount}%</b>}</div>
          </div>
        )}
      </section>

      <section className="home-section page-width">
        <div className="section-title-row stacked"><div><h2>{t.home.latest}</h2><p>{t.home.latestText}</p></div><Link href={scopedShopHref()}>{language === 'bg' ? 'Всички продукти' : 'All products'} <ArrowRight /></Link></div>
        <ProductGrid products={latestProducts} />
      </section>

      <section className="audience-banners page-width">
        <Link href="/women" onClick={() => switchAudience('women')} className="audience-banner">
          {products.find((p) => productMatchesAudience(p, 'women') && p.image)?.image ? <Image src={products.find((p) => productMatchesAudience(p, 'women') && p.image).image} alt="Women" fill sizes="33vw"/> : <div className="audience-placeholder" />}
          <span>{t.nav.women}<ArrowRight /></span>
        </Link>
        <Link href="/kids" onClick={() => switchAudience('kids')} className="audience-banner audience-banner-no-photo">
          <div className="audience-placeholder"><b>GERPINA</b><small>{language === 'bg' ? 'Детска колекция' : 'Kids collection'}</small></div>
          <span>{t.nav.kids}<ArrowRight /></span>
        </Link>
        <Link href="/men" onClick={() => switchAudience('men')} className="audience-banner">
          {products.find((p) => productMatchesAudience(p, 'men') && p.image)?.image ? <Image src={products.find((p) => productMatchesAudience(p, 'men') && p.image).image} alt="Men" fill sizes="33vw"/> : <div className="audience-placeholder"><b>GERPINA</b></div>}
          <span>{t.nav.men}<ArrowRight /></span>
        </Link>
      </section>

      <section className="econt-strip">
        <div className="page-width econt-inner"><TruckIcon size={34}/><div><h3>{t.home.econtTitle}</h3><p>{t.home.econtText}</p></div></div>
      </section>
    </main>
  );
}
