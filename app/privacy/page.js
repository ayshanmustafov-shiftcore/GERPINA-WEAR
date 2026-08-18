'use client';

import LegalPage from '@/components/LegalPage';
import { useLanguage } from '@/components/LanguageProvider';
import { siteConfig } from '@/data/site';

export default function PrivacyPage() {
  const { language } = useLanguage();
  const bg = language === 'bg';
  return (
    <LegalPage
      eyebrow={bg ? 'ЗАЩИТА НА ДАННИТЕ' : 'DATA PROTECTION'}
      title={bg ? 'Политика за поверителност' : 'Privacy Policy'}
      intro={bg ? 'Как ГЕРПИНА УЕЪР ЕООД обработва лични данни при използване на сайта, поръчки, доставка и обслужване.' : 'How GERPINA WEAR EOOD processes personal data when you use the site, place orders, receive deliveries and contact support.'}
    >
      <section><h2>1. {bg ? 'Администратор' : 'Controller'}</h2><p><b>{siteConfig.company.name[language]}</b>, {bg ? 'ЕИК' : 'UIC'} {siteConfig.company.eik}, {siteConfig.company.registeredAddress[language]}.</p><p>{bg ? 'Контакт по въпроси за лични данни' : 'Privacy contact'}: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>, {siteConfig.contact.phone}.</p></section>

      <section><h2>2. {bg ? 'Какви данни обработваме' : 'Data we process'}</h2><ul><li>{bg ? 'име и фамилия;' : 'first and last name;'}</li><li>{bg ? 'телефон и имейл (когато е предоставен);' : 'phone and email (where provided);'}</li><li>{bg ? 'населено място, избран офис на Еконт или адрес за доставка;' : 'city, selected Econt office or delivery address;'}</li><li>{bg ? 'данни за поръчката – продукти, размери, количества, цена и бележка към поръчката;' : 'order data – products, sizes, quantities, price and order notes;'}</li><li>{bg ? 'технически данни, необходими за сигурност и функциониране на сайта.' : 'technical data necessary for site security and operation.'}</li></ul></section>

      <section><h2>3. {bg ? 'Цели и правни основания' : 'Purposes and legal bases'}</h2><p>{bg ? 'Обработваме данни, когато това е необходимо за приемане и изпълнение на поръчка, доставка, комуникация с клиента, упражняване на права по връщане/рекламация, изпълнение на законови счетоводни и данъчни задължения и защита на законни интереси като сигурност и предотвратяване на злоупотреби.' : 'We process data where necessary to accept and perform an order, arrange delivery, communicate with customers, handle returns/complaints, comply with accounting/tax obligations and protect legitimate interests such as security and abuse prevention.'}</p><p>{bg ? 'Съгласие се използва само когато законът изисква такова – например за бъдещи незадължителни аналитични или маркетингови технологии.' : 'Consent is used only where required, for example for future optional analytics or marketing technologies.'}</p></section>

      <section><h2>4. {bg ? 'Получатели на данни' : 'Recipients'}</h2><p>{bg ? 'Данни могат да бъдат предоставяни само доколкото е необходимо на доставчици, които подпомагат изпълнението на услугата, включително Еконт за доставка и наложен платеж, Vercel за хостинг, Resend за системни имейли и Google Workspace за получаване и обработка на служебната кореспонденция. Данни могат да се предоставят и на компетентни органи, когато това се изисква по закон.' : 'Data may be shared, only as necessary, with service providers supporting the transaction, including Econt for delivery/COD, Vercel for hosting, Resend for transactional email and Google Workspace for business correspondence. Data may also be disclosed to competent authorities where required by law.'}</p><p>{bg ? 'Когато доставчик обработва данни извън Европейското икономическо пространство, се прилагат съответните законови механизми и гаранции за международен трансфер, когато са приложими.' : 'Where a provider processes data outside the EEA, the applicable lawful transfer mechanisms and safeguards are used where required.'}</p></section>

      <section><h2>5. {bg ? 'Срокове за съхранение' : 'Retention'}</h2><p>{bg ? 'Данните се пазят само толкова дълго, колкото е необходимо за съответната цел и за законово изискуемите срокове, включително срокове за счетоводни/данъчни документи, защита на права и разглеждане на рекламации. Данните в локалната количка и предпочитанията се пазят в браузъра на потребителя до изтриването им или до изчистване на данните на браузъра.' : 'Data is kept only as long as necessary for the relevant purpose and for statutory retention periods, including accounting/tax records, defence of legal claims and complaints. Local cart and preference data stays in the customer browser until deleted or browser storage is cleared.'}</p></section>

      <section><h2>6. {bg ? 'Права на потребителя' : 'Your rights'}</h2><p>{bg ? 'При условията на GDPR имате право на достъп, коригиране, изтриване, ограничаване, възражение и преносимост, когато съответното право е приложимо. Когато обработването е основано на съгласие, то може да бъде оттеглено за в бъдеще.' : 'Subject to the GDPR, you may have rights of access, rectification, erasure, restriction, objection and portability where applicable. Where processing is based on consent, consent may be withdrawn for the future.'}</p><p>{bg ? 'Можете да подадете жалба до Комисията за защита на личните данни (КЗЛД), ако считате, че личните ви данни се обработват незаконосъобразно.' : 'You may lodge a complaint with the Bulgarian Commission for Personal Data Protection if you believe your data is processed unlawfully.'}</p></section>

      <section><h2>7. {bg ? 'Профилиране и автоматизирани решения' : 'Profiling and automated decisions'}</h2><p>{bg ? 'В текущата версия на магазина не се извършва автоматизирано вземане на решения, което поражда правни последици за клиента.' : 'The current store does not use automated decision-making that produces legal effects for customers.'}</p></section>

      <section><h2>8. {bg ? 'Сигурност и промени' : 'Security and changes'}</h2><p>{bg ? 'Прилагаме подходящи технически и организационни мерки за ограничаване на достъпа до лични данни. Политиката може да бъде актуализирана при промени в услугите, доставчиците или нормативните изисквания.' : 'Appropriate technical and organisational measures are used to restrict access to personal data. This policy may be updated when services, providers or legal requirements change.'}</p></section>
    </LegalPage>
  );
}
