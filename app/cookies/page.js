'use client';

import LegalPage from '@/components/LegalPage';
import { useLanguage } from '@/components/LanguageProvider';

export default function CookiesPage() {
  const { language } = useLanguage();
  const bg = language === 'bg';
  return (
    <LegalPage eyebrow={bg ? 'НАСТРОЙКИ НА САЙТА' : 'SITE SETTINGS'} title={bg ? 'Политика за бисквитки' : 'Cookie Policy'} intro={bg ? 'Какви технологии за съхранение използва GERPINA Wear.' : 'Storage technologies used by GERPINA Wear.'}>
      <section><h2>1. {bg ? 'Какво използваме сега' : 'What we currently use'}</h2><p>{bg ? 'В текущата версия сайтът използва основно локално съхранение в браузъра за функционалности като език, избрана секция Жени/Мъже/Деца, любими продукти, количка и предпочитание за бисквитки. Тези данни са необходими или функционални за поисканата от вас услуга и не се използват за рекламно профилиране.' : 'The current site mainly uses browser local storage for language, Women/Men/Kids scope, favourites, cart and cookie preference. This data is necessary or functional for the requested service and is not used for advertising profiling.'}</p></section>
      <section><h2>2. {bg ? 'Анализ и реклама' : 'Analytics and advertising'}</h2><p>{bg ? 'В тази тестова версия не са активирани рекламни пиксели или аналитични тракери. Ако в бъдеще бъдат добавени Meta Pixel, Google Analytics, Google Ads или други незадължителни технологии, те ще бъдат блокирани до получаване на предварително съгласие, когато такова се изисква.' : 'No advertising pixels or analytics trackers are enabled in this test build. If Meta Pixel, Google Analytics, Google Ads or other optional technologies are added later, they will be blocked until prior consent is obtained where required.'}</p></section>
      <section><h2>3. {bg ? 'Промяна на избора' : 'Changing your choice'}</h2><p>{bg ? 'Можете да промените избора си чрез бутона „Настройки за бисквитки“ във футъра. Изчистването на данните на браузъра също премахва локално запазените предпочитания.' : 'You can change your choice through “Cookie settings” in the footer. Clearing browser data also removes locally stored preferences.'}</p></section>
    </LegalPage>
  );
}
