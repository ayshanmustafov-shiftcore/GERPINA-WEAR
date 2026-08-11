'use client';

import { useLanguage } from '@/components/LanguageProvider';

export default function PrivacyPage() {
  const { language, t } = useLanguage();
  const bg = language === 'bg';
  return (
    <main className="legal-page shell">
      <span className="construction-label">{t.common.draft}</span>
      <p className="eyebrow">GERPINA WEAR / PRIVACY</p>
      <h1>{bg ? 'Поверителност' : 'Privacy'}</h1>
      <p className="legal-intro">{bg ? 'Финалната политика ще бъде попълнена с данните на администратора на лични данни и точните услуги, използвани от сайта.' : 'The final policy will be completed with the data controller details and the exact services used by the website.'}</p>
      <div className="legal-stack">
        <section><h2>1. {bg ? 'Какви данни ще се обработват' : 'Data that will be processed'}</h2><p>{bg ? 'При поръчка: име, телефон, по избор имейл, град, офис на Еконт или адрес и информацията, необходима за изпълнение на поръчката.' : 'For an order: name, phone number, optional email, city, Econt office or address, and information needed to fulfil the order.'}</p></section>
        <section><h2>2. {bg ? 'Защо са нужни' : 'Why it is needed'}</h2><p>{bg ? 'За обработване, потвърждаване и доставка на поръчката, както и за изпълнение на приложими законови задължения.' : 'To process, confirm and deliver the order, and to meet applicable legal obligations.'}</p></section>
        <section><h2>3. {bg ? 'Бисквитки и анализи' : 'Cookies & analytics'}</h2><p>{bg ? 'Няма да бъдат описвани услуги, които сайтът реално не използва. Този раздел ще се актуализира при добавяне на анализи или рекламни инструменти.' : 'The policy will not list services the site does not actually use. This section will be updated when analytics or advertising tools are added.'}</p></section>
      </div>
    </main>
  );
}
