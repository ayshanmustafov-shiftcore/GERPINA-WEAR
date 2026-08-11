'use client';

import { useLanguage } from '@/components/LanguageProvider';

export default function TermsPage() {
  const { language, t } = useLanguage();
  const bg = language === 'bg';
  return (
    <main className="legal-page shell">
      <span className="construction-label">{t.common.draft}</span>
      <p className="eyebrow">GERPINA WEAR / TERMS</p>
      <h1>{bg ? 'Общи условия' : 'Terms & conditions'}</h1>
      <p className="legal-intro">{bg ? 'Това е визуална чернова. Преди сайта да приема реални поръчки, тук трябва да бъдат добавени данните на търговеца и финалните условия за продажба, доставка, плащане, рекламации и връщане.' : 'This is a visual draft. Before the site accepts real orders, the seller details and final terms for sales, delivery, payment, complaints and returns must be added here.'}</p>
      <div className="legal-stack">
        <section><h2>1. {bg ? 'Търговец' : 'Seller'}</h2><p>{bg ? 'Фирмени данни — предстои да бъдат добавени.' : 'Business details — to be added.'}</p></section>
        <section><h2>2. {bg ? 'Поръчки' : 'Orders'}</h2><p>{bg ? 'Процесът за подаване и потвърждаване на поръчка ще бъде описан след активиране на checkout системата.' : 'The order submission and confirmation process will be described once checkout is enabled.'}</p></section>
        <section><h2>3. {bg ? 'Цени и плащане' : 'Prices & payment'}</h2><p>{bg ? 'Всички продуктови цени ще се показват в евро. Начинът на плащане чрез Еконт ще бъде финализиран преди пускането.' : 'All product prices will be displayed in euro. The Econt payment process will be finalised before launch.'}</p></section>
        <section><h2>4. {bg ? 'Доставка, връщане и рекламации' : 'Delivery, returns & complaints'}</h2><p>{bg ? 'Финалните правила ще бъдат добавени след потвърждение на търговския процес и правните данни.' : 'Final rules will be added after the commercial process and legal details are confirmed.'}</p></section>
      </div>
    </main>
  );
}
