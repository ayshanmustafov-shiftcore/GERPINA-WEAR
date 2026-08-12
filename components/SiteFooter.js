'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function SiteFooter() {
  const { language } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="footer-grid page-width">
        <div className="footer-brand-block">
          <div className="footer-logo-wrap"><Image src="/gerpina-logo.jpg" alt="GERPINA Wear" fill sizes="180px" /></div>
          <p>{language === 'bg' ? 'Подбрана мода за България. Каталогът се подготвя с реалните наличности.' : 'Curated fashion for Bulgaria. The catalogue is being prepared with the real inventory.'}</p>
        </div>
        <div>
          <h4>{language === 'bg' ? 'Пазаруване' : 'Shopping'}</h4>
          <Link href="/women">{language === 'bg' ? 'Жени' : 'Women'}</Link>
          <Link href="/kids">{language === 'bg' ? 'Деца' : 'Kids'}</Link>
          <Link href="/men">{language === 'bg' ? 'Мъже' : 'Men'}</Link>
          <Link href="/shop">{language === 'bg' ? 'Всички продукти' : 'All products'}</Link>
        </div>
        <div>
          <h4>{language === 'bg' ? 'Помощ' : 'Help'}</h4>
          <Link href="/delivery-returns">{language === 'bg' ? 'Доставка и връщане' : 'Delivery & returns'}</Link>
          <Link href="/contact">{language === 'bg' ? 'Контакти' : 'Contact'}</Link>
          <Link href="/terms">{language === 'bg' ? 'Общи условия' : 'Terms'}</Link>
          <Link href="/privacy">{language === 'bg' ? 'Поверителност' : 'Privacy'}</Link>
        </div>
        <div>
          <h4>GERPINA</h4>
          <Link href="/about">{language === 'bg' ? 'За нас' : 'About us'}</Link>
          <span>{language === 'bg' ? 'България' : 'Bulgaria'}</span>
          <span>EUR (€)</span>
        </div>
      </div>
      <div className="footer-bottom page-width"><span>© 2026 GERPINA Wear</span><span>{language === 'bg' ? 'Демо версия на магазина' : 'Store preview version'}</span></div>
    </footer>
  );
}
