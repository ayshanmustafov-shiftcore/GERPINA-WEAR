'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight } from '@/components/Icons';
import { products, productMatchesAudience } from '@/data/products';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';

const COLLECTIONS = [
  { key: 'women', eyebrowBg: 'ЖЕНИ', eyebrowEn: 'WOMEN' },
  { key: 'men', eyebrowBg: 'МЪЖЕ', eyebrowEn: 'MEN' },
  { key: 'kids', eyebrowBg: 'ДЕЦА', eyebrowEn: 'KIDS' },
];

export default function AudienceCollectionSlider() {
  const trackRef = useRef(null);
  const { language, t } = useLanguage();
  const { setActiveAudience } = useStore();

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="collection-slider-section page-width" aria-label={language === 'bg' ? 'Колекции' : 'Collections'}>
      <div className="section-title-row collection-slider-heading">
        <div>
          <h2>{language === 'bg' ? 'Избери колекция' : 'Choose a collection'}</h2>
          <p>{language === 'bg' ? 'Жени, мъже и деца са разделени в отделни слайдове за по-лесно пазаруване.' : 'Women, men and kids are separated into dedicated slides for easier shopping.'}</p>
        </div>
        <div className="collection-slider-controls" aria-label={language === 'bg' ? 'Навигация на слайдовете' : 'Slide navigation'}>
          <button type="button" onClick={() => move(-1)} aria-label={language === 'bg' ? 'Предишен слайд' : 'Previous slide'}>‹</button>
          <button type="button" onClick={() => move(1)} aria-label={language === 'bg' ? 'Следващ слайд' : 'Next slide'}>›</button>
        </div>
      </div>

      <div className="collection-slider-track" ref={trackRef}>
        {COLLECTIONS.map((collection) => {
          const audienceProducts = products.filter((product) => productMatchesAudience(product, collection.key));
          const visual = audienceProducts.find((product) => product.image) || null;
          const label = collection.key === 'women' ? t.nav.women : collection.key === 'men' ? t.nav.men : t.nav.kids;
          return (
            <Link
              href={`/${collection.key}`}
              key={collection.key}
              className={`collection-slide collection-slide-${collection.key}`}
              onClick={() => setActiveAudience(collection.key)}
            >
              <div className="collection-slide-copy">
                <span>{language === 'bg' ? collection.eyebrowBg : collection.eyebrowEn}</span>
                <h3>{label}</h3>
                <p>{language === 'bg' ? `${audienceProducts.length} налични продукта` : `${audienceProducts.length} products available`}</p>
                <b>{language === 'bg' ? 'Разгледай колекцията' : 'Explore collection'} <ArrowRight /></b>
              </div>
              <div className="collection-slide-visual">
                {visual?.image ? (
                  <Image src={visual.image} alt={`${visual.brand} ${visual.name[language]}`} fill sizes="(max-width: 760px) 70vw, 430px" />
                ) : (
                  <div className="collection-slide-placeholder"><strong>GERPINA</strong><small>{label}</small></div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
