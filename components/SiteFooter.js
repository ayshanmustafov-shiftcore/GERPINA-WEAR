'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { siteConfig } from '@/data/site';

export default function SiteFooter() {
  const { language } = useLanguage();
  const bg = language === 'bg';
  const openCookies = () => window.dispatchEvent(new Event('gerpina:cookie-settings'));
  return (
    <footer className="site-footer">
      <div className="footer-grid page-width">
        <div className="footer-brand-block">
          <div className="footer-logo-wrap"><Image src="/gerpina-logo.jpg" alt="GERPINA Wear" fill sizes="180px" /></div>
          <p>{bg ? 'Подбрана мода за жени, мъже и деца. Ограничени наличности и ясни цени.' : 'Curated fashion for women, men and kids. Limited stock and clear prices.'}</p>
          <div className="footer-company"><span>{siteConfig.company.name[language]}</span><span>{bg ? 'ЕИК' : 'UIC'} {siteConfig.company.eik}</span><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a><a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a></div>
        </div>
        <div>
          <h4>{bg ? 'Пазаруване' : 'Shopping'}</h4>
          <Link href="/women">{bg ? 'Жени' : 'Women'}</Link><Link href="/kids">{bg ? 'Деца' : 'Kids'}</Link><Link href="/men">{bg ? 'Мъже' : 'Men'}</Link><Link href="/shop">{bg ? 'Всички продукти' : 'All products'}</Link>
        </div>
        <div>
          <h4>{bg ? 'Помощ' : 'Help'}</h4>
          <Link href="/delivery-returns">{bg ? 'Доставка и връщане' : 'Delivery & returns'}</Link><Link href="/contact">{bg ? 'Контакти' : 'Contact'}</Link><Link href="/terms">{bg ? 'Общи условия' : 'Terms'}</Link><Link href="/privacy">{bg ? 'Поверителност' : 'Privacy'}</Link><Link href="/cookies">{bg ? 'Бисквитки' : 'Cookies'}</Link><button className="footer-cookie-button" onClick={openCookies}>{bg ? 'Настройки за бисквитки' : 'Cookie settings'}</button>
        </div>
        <div>
          <h4>GERPINA</h4><Link href="/about">{bg ? 'За нас' : 'About us'}</Link><span>{bg ? 'България' : 'Bulgaria'}</span><span>EUR (€)</span><span>{bg ? 'Не е регистрирана по ДДС' : 'Not VAT registered'}</span>
        </div>
      </div>
      <div className="footer-bottom page-width"><span>© 2026 GERPINA Wear</span><span>{bg ? 'Тестова версия · реалните поръчки са изключени' : 'Test build · real orders are disabled'}</span></div>
    </footer>
  );
}
