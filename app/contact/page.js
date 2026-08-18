'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { siteConfig } from '@/data/site';

export default function ContactPage() {
  const { language } = useLanguage();
  const bg = language === 'bg';
  return (
    <main className="contact-page page-width">
      <header className="plain-heading contact-heading"><span>GERPINA WEAR</span><h1>{bg ? 'Контакт & Помощ' : 'Contact & Help'}</h1><p>{bg ? 'За въпроси за продукти, поръчки, доставка, връщане или рекламация.' : 'For questions about products, orders, delivery, returns or complaints.'}</p></header>
      <div className="contact-grid">
        <a className="contact-card" href={`tel:${siteConfig.contact.phone}`}><small>{bg ? 'ТЕЛЕФОН' : 'PHONE'}</small><strong>{siteConfig.contact.phone}</strong><span>{bg ? 'Обади се' : 'Call us'} →</span></a>
        <a className="contact-card" href={`mailto:${siteConfig.contact.email}`}><small>{bg ? 'ИМЕЙЛ' : 'EMAIL'}</small><strong>{siteConfig.contact.email}</strong><span>{bg ? 'Изпрати имейл' : 'Send email'} →</span></a>
        <div className="contact-card"><small>{bg ? 'ФИРМА' : 'COMPANY'}</small><strong>{siteConfig.company.name[language]}</strong><span>{bg ? `ЕИК ${siteConfig.company.eik}` : `UIC ${siteConfig.company.eik}`}</span></div>
      </div>
      <div className="contact-help-note"><h2>{bg ? 'Връщане на поръчка?' : 'Returning an order?'}</h2><p>{bg ? 'Първо се свържете с нас. Ще получите конкретни указания за връщането чрез Еконт.' : 'Contact us first. We will provide the specific Econt return instructions.'}</p><a href="/delivery-returns">{bg ? 'Доставка и връщане' : 'Delivery & returns'} →</a></div>
    </main>
  );
}
