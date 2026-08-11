'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon, RulerIcon, TagIcon, TruckIcon } from '@/components/Icons';
import { useLanguage } from '@/components/LanguageProvider';

const previewImages = [
  '/images/products/preview-0000.jpg',
  '/images/products/preview-0005.jpg',
  '/images/products/preview-0008.jpg',
  '/images/products/preview-0013.jpg',
  '/images/products/preview-0019.jpg',
  '/images/products/preview-0020.jpg',
];

export default function HomePage() {
  const { language, t } = useLanguage();
  return (
    <main>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p className="hero-body">{t.hero.body}</p>
          <div className="hero-actions">
            <Link href="/shop" className="button button-dark">{t.hero.primary}<ArrowIcon /></Link>
            <Link href="/about" className="button button-ghost">{t.hero.secondary}</Link>
          </div>
          <div className="hero-note"><span></span>{t.hero.note}</div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo hero-photo-main">
            <Image src="/images/products/preview-0000.jpg" alt="GERPINA Wear preview" fill priority sizes="(max-width: 900px) 70vw, 31vw" />
          </div>
          <div className="hero-photo hero-photo-top">
            <Image src="/images/products/preview-0005.jpg" alt="GERPINA Wear preview" fill sizes="(max-width: 900px) 35vw, 16vw" />
          </div>
          <div className="hero-photo hero-photo-bottom">
            <Image src="/images/products/preview-0020.jpg" alt="GERPINA Wear preview" fill sizes="(max-width: 900px) 34vw, 15vw" />
          </div>
          <div className="hero-logo-chip">
            <Image src="/gerpina-logo.jpg" alt="GERPINA Wear" fill sizes="130px" />
          </div>
        </div>
      </section>

      <section className="saving-section">
        <div className="shell saving-grid">
          <div className="saving-copy">
            <p className="eyebrow">{t.savings.kicker}</p>
            <h2>{t.savings.title}</h2>
            <p>{t.savings.body}</p>
          </div>
          <div className="price-story">
            <span className="price-example-label">{t.savings.example}</span>
            <div className="price-story-row">
              <div>
                <small>{t.savings.original}</small>
                <strong className="old-price">€320</strong>
              </div>
              <div className="discount-arrow">→</div>
              <div>
                <small>{t.savings.our}</small>
                <strong>€80</strong>
              </div>
              <div className="discount-badge">−75%</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">{t.categories.kicker}</p>
            <h2>{t.categories.title}</h2>
          </div>
          <Link href="/shop" className="text-link">{t.nav.shop} <ArrowIcon /></Link>
        </div>
        <div className="category-grid">
          {[
            ['/women', t.categories.women, t.categories.womenText, '01'],
            ['/kids', t.categories.kids, t.categories.kidsText, '02'],
            ['/men', t.categories.men, t.categories.menText, '03'],
          ].map(([href, title, text, number]) => (
            <Link href={href} className="category-card" key={href}>
              <span className="category-number">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <span className="category-arrow"><ArrowIcon /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section preview-section">
        <div className="shell">
          <div className="section-heading preview-heading">
            <p className="eyebrow">{t.preview.kicker}</p>
            <h2>{t.preview.title}</h2>
            <p>{t.preview.body}</p>
          </div>
          <div className="product-preview-grid">
            {previewImages.map((src, index) => (
              <article className="preview-card" key={src}>
                <div className="preview-image">
                  <Image src={src} alt={`GERPINA Wear catalogue preview ${index + 1}`} fill sizes="(max-width: 650px) 50vw, (max-width: 1000px) 33vw, 20vw" />
                  <span className="soon-badge">{t.preview.soon}</span>
                </div>
                <div className="preview-card-copy">
                  <span>GERPINA WEAR</span>
                  <strong>{t.preview.stockPending}</strong>
                  <small>{t.common.inStock} · —</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell why-section">
        <div className="section-heading preview-heading">
          <p className="eyebrow">{t.why.kicker}</p>
          <h2>{t.why.title}</h2>
        </div>
        <div className="benefit-grid">
          <article><TagIcon /><h3>{t.why.oneTitle}</h3><p>{t.why.oneText}</p></article>
          <article><RulerIcon /><h3>{t.why.twoTitle}</h3><p>{t.why.twoText}</p></article>
          <article><TruckIcon /><h3>{t.why.threeTitle}</h3><p>{t.why.threeText}</p></article>
        </div>
      </section>

      <section className="cta-section shell">
        <div className="cta-black">
          <div>
            <p className="eyebrow gold">{t.newsletter.eyebrow}</p>
            <h2>{t.newsletter.title}</h2>
            <p>{t.newsletter.body}</p>
          </div>
          <Link href="/shop" className="button button-gold">{t.newsletter.button}<ArrowIcon /></Link>
        </div>
      </section>
    </main>
  );
}
