'use client';

import Link from 'next/link';
import { BagIcon } from '@/components/Icons';
import { useLanguage } from '@/components/LanguageProvider';

export default function CartPage() {
  const { language, t } = useLanguage();
  return (
    <main className="shell cart-page">
      <p className="eyebrow">GERPINA WEAR / {t.nav.cart.toUpperCase()}</p>
      <h1>{t.nav.cart}</h1>
      <div className="empty-cart">
        <BagIcon size={34} />
        <h2>{language === 'bg' ? 'Количката е празна' : 'Your cart is empty'}</h2>
        <p>{language === 'bg' ? 'Ще можеш да добавяш размер, цвят и количество, когато каталогът бъде зареден.' : 'You will be able to add size, colour and quantity when the catalogue is loaded.'}</p>
        <Link href="/shop" className="button button-dark">{t.hero.primary}</Link>
      </div>
    </main>
  );
}
