'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function ConstructionBlock({ eyebrow, title, description, children }) {
  const { t } = useLanguage();
  return (
    <section className="construction-wrap shell">
      <div className="construction-card">
        <span className="construction-label">{t.common.underConstruction}</span>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title || t.common.underConstruction}</h1>
        <p>{description || t.common.underConstructionBody}</p>
        {children}
        <Link className="button button-dark" href="/">{t.common.backHome}</Link>
      </div>
    </section>
  );
}
