'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function ConstructionBlock({ titleBg, titleEn, bodyBg, bodyEn }) {
  const { language } = useLanguage();
  return (
    <main className="construction-page page-width">
      <div className="construction-card">
        <span>GERPINA WEAR</span>
        <h1>{language === 'bg' ? titleBg : titleEn}</h1>
        <p>{language === 'bg' ? bodyBg : bodyEn}</p>
        <div className="construction-mark">{language === 'bg' ? 'В ПРОЦЕС НА ИЗГРАЖДАНЕ' : 'UNDER CONSTRUCTION'}</div>
        <Link href="/shop">{language === 'bg' ? 'Разгледай магазина' : 'Browse the shop'}</Link>
      </div>
    </main>
  );
}
