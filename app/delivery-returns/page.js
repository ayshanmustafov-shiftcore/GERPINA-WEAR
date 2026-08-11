'use client';

import { useLanguage } from '@/components/LanguageProvider';

export default function DeliveryReturnsPage() {
  const { language, t } = useLanguage();
  const bg = language === 'bg';
  return (
    <main className="legal-page shell">
      <span className="construction-label">{t.common.draft}</span>
      <p className="eyebrow">GERPINA WEAR / DELIVERY</p>
      <h1>{bg ? 'Доставка и връщане' : 'Delivery & returns'}</h1>
      <p className="legal-intro">{bg ? 'Тази страница е подготвена като структура. Финалните срокове, цени и условия ще бъдат потвърдени преди пускането на магазина.' : 'This page is prepared as a structure. Final delivery times, prices and return conditions will be confirmed before launch.'}</p>
      <div className="legal-grid">
        <section><span>01</span><h2>{bg ? 'Доставка с Еконт' : 'Delivery with Econt'}</h2><p>{bg ? 'Клиентът ще може да избира доставка до офис на Еконт или до адрес в България. Точните транспортни разходи ще бъдат уточнени.' : 'Customers will be able to choose delivery to an Econt office or to an address in Bulgaria. Exact shipping charges will be confirmed.'}</p></section>
        <section><span>02</span><h2>{bg ? 'Плащане' : 'Payment'}</h2><p>{bg ? 'Плащането при получаване чрез Еконт ще бъде описано тук след потвърждаване на точния оперативен процес.' : 'Payment on receipt through Econt will be described here after the exact operational process is confirmed.'}</p></section>
        <section><span>03</span><h2>{bg ? 'Връщане' : 'Returns'}</h2><p>{bg ? 'Финалната политика за връщане ще бъде съобразена с приложимите правила за онлайн продажби в България и конкретния тип стоки.' : 'The final returns policy will be aligned with applicable Bulgarian online-sales rules and the specific type of goods sold.'}</p></section>
      </div>
    </main>
  );
}
