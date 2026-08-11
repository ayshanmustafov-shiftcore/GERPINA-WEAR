'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { ArrowIcon } from '@/components/Icons';

export default function AboutPage() {
  const { language } = useLanguage();
  const bg = language === 'bg';
  return (
    <main>
      <section className="about-hero shell">
        <div>
          <p className="eyebrow">GERPINA WEAR / {bg ? 'ЗА НАС' : 'ABOUT'}</p>
          <h1>{bg ? 'Хубавата дреха не трябва да струва като нова колекция.' : 'Good clothing does not need a new-season price tag.'}</h1>
        </div>
        <p>{bg ? 'GERPINA Wear е създадена около проста идея: да открива стойност в качествени модни артикули и да я предава на клиента чрез ясна, видима цена.' : 'GERPINA Wear is built around a simple idea: find value in quality fashion pieces and pass that value to the customer through clear, visible pricing.'}</p>
      </section>
      <section className="about-story shell">
        <div className="about-image"><Image src="/images/products/preview-0008.jpg" alt="GERPINA Wear selection" fill sizes="45vw" /></div>
        <div className="about-copy">
          <span className="large-index">01</span>
          <h2>{bg ? 'Подбрано, не претрупано.' : 'Curated, not crowded.'}</h2>
          <p>{bg ? 'Селекцията се купува на едро и се предлага на значително по-ниски цени. Когато разполагаме с оригинална цена от етикета, тя се показва до GERPINA цената, за да е разликата очевидна.' : 'The selection is purchased in bulk and offered at significantly lower prices. When an original tag price is available, it is displayed next to the GERPINA price so the difference is obvious.'}</p>
          <p>{bg ? 'Каталогът ще включва дамски, детски и избрани мъжки артикули, с възможност селекцията да се разширява.' : 'The catalogue will include women’s, kids’ and selected men’s pieces, with room for the range to expand.'}</p>
          <Link href="/shop" className="text-link">{bg ? 'Към магазина' : 'Go to shop'} <ArrowIcon /></Link>
        </div>
      </section>
      <section className="manifesto">
        <div className="shell manifesto-inner">
          <span>GERPINA</span>
          <p>{bg ? 'choose your style — без да плащаш само за етикета.' : 'choose your style — without paying just for the tag.'}</p>
        </div>
      </section>
    </main>
  );
}
