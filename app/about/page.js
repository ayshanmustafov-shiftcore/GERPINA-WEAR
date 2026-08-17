'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/Icons';
import { useLanguage } from '@/components/LanguageProvider';

export default function AboutPage() {
  const { language } = useLanguage();
  return (
    <main className="about-page">
      <section className="about-intro page-width">
        <span>GERPINA WEAR</span>
        <h1>{language === 'bg' ? 'Подбрана мода. По-добра цена.' : 'Curated fashion. Better value.'}</h1>
        <p>{language === 'bg' ? 'GERPINA Wear се изгражда като онлайн магазин за подбрани дрехи в България, с фокус върху ясни цени, реални наличности и лесна доставка с Еконт.' : 'GERPINA Wear is being built as an online fashion shop for Bulgaria, focused on clear prices, real availability and straightforward Econt delivery.'}</p>
      </section>
      <section className="about-visual page-width">
        <div className="about-image-large"><Image src="/images/products/IMG-20260809-WA0019.jpg" alt="GERPINA selection" fill sizes="60vw" /></div>
        <div className="about-message"><b>01</b><h2>{language === 'bg' ? 'Намираме стойността в добрата находка.' : 'We find value in a good fashion find.'}</h2><p>{language === 'bg' ? 'Каталогът вече използва продажните цени, размерите и наличностите от инвентара. Оригиналните цени от етикетите се допълват постепенно, а временните стойности са отбелязани като DEMO.' : 'The catalogue now uses selling prices, sizes and availability from the inventory. Original tag prices are being completed progressively, while temporary values are marked as DEMO.'}</p><Link href="/shop">{language === 'bg' ? 'Виж селекцията' : 'View selection'}<ArrowRight /></Link></div>
      </section>
      <section className="about-logo-band"><div className="page-width"><div className="about-logo"><Image src="/gerpina-logo.jpg" alt="GERPINA Wear" fill sizes="320px" /></div><p>{language === 'bg' ? 'Choose your style.' : 'Choose your style.'}</p></div></section>
    </main>
  );
}
