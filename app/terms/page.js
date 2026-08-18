'use client';

import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { useLanguage } from '@/components/LanguageProvider';
import { siteConfig } from '@/data/site';

export default function TermsPage() {
  const { language } = useLanguage();
  const bg = language === 'bg';
  return (
    <LegalPage
      eyebrow={bg ? 'ПРАВНА ИНФОРМАЦИЯ' : 'LEGAL INFORMATION'}
      title={bg ? 'Общи условия' : 'Terms & Conditions'}
      intro={bg ? 'Условия за използване на gerpina-wear.com и за покупка на стоки от ГЕРПИНА УЕЪР ЕООД.' : 'Terms for using gerpina-wear.com and purchasing goods from GERPINA WEAR EOOD.'}
    >
      <section>
        <h2>1. {bg ? 'Търговец' : 'Trader'}</h2>
        <p><b>{siteConfig.company.name[language]}</b>, {bg ? 'ЕИК' : 'UIC'}: <b>{siteConfig.company.eik}</b>.</p>
        <p>{bg ? 'Адрес по регистрация' : 'Registered address'}: {siteConfig.company.registeredAddress[language]}.</p>
        <p>{bg ? 'Телефон' : 'Phone'}: <a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a> · {bg ? 'Имейл' : 'Email'}: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
        <p>{bg ? 'Дружеството не е регистрирано по ДДС.' : 'The company is not VAT registered.'}</p>
      </section>

      <section>
        <h2>2. {bg ? 'Предмет и приложимост' : 'Scope'}</h2>
        <p>{bg ? 'Настоящите Общи условия уреждат отношенията между ГЕРПИНА УЕЪР ЕООД и потребителите на онлайн магазина gerpina-wear.com при разглеждане, поръчване, плащане, доставка, отказ и рекламация на стоки.' : 'These Terms govern the relationship between GERPINA WEAR EOOD and users of gerpina-wear.com when browsing, ordering, paying, receiving, returning or complaining about goods.'}</p>
        <p>{bg ? 'Магазинът е насочен към доставки на територията на България.' : 'The store currently delivers within Bulgaria.'}</p>
      </section>

      <section>
        <h2>3. {bg ? 'Продукти и цени' : 'Products and prices'}</h2>
        <p>{bg ? 'Основните характеристики, наличност, размери и продажна цена се показват на страницата на съответния продукт. Всички крайни цени са в евро (EUR). Дружеството не е регистрирано по ДДС.' : 'Key characteristics, availability, sizes and selling price are shown on each product page. Final prices are displayed in euro (EUR). The company is not VAT registered.'}</p>
        <p>{bg ? 'Тестови или демонстрационни референтни цени, когато са обозначени като DEMO, не представляват окончателно публично ценово твърдение и трябва да бъдат заменени преди търговския старт.' : 'Reference prices marked DEMO are development-only values and must be replaced before commercial launch.'}</p>
      </section>

      <section>
        <h2>4. {bg ? 'Поръчка и сключване на договор' : 'Orders and contract formation'}</h2>
        <p>{bg ? 'Потребителят избира продукт, размер и количество, попълва данните за доставка и потвърждава поръчката. Преди окончателното потвърждение се показват продуктите, продажната цена, цената за доставка и общата сума.' : 'The customer selects the product, size and quantity, enters delivery details and confirms the order. Before final confirmation, the products, selling price, delivery cost and total are displayed.'}</p>
        <p>{bg ? 'В тестовата версия създадените товарителници са само в тестовата среда на Еконт и не представляват реална поръчка. При активиране на магазина реалната поръчка ще бъде потвърдена чрез съобщение на сайта и/или имейл.' : 'In the test version, waybills are created only in Econt DEMO and do not constitute a real order. When the store is activated, a real order will be confirmed on-screen and/or by email.'}</p>
      </section>

      <section>
        <h2>5. {bg ? 'Плащане' : 'Payment'}</h2>
        <p>{bg ? 'Към момента плащането е с наложен платеж при получаване чрез Еконт. Стойността на куриерската услуга се изчислява от системата на Еконт и се показва преди потвърждаване на поръчката.' : 'Payment is currently cash on delivery through Econt. The courier charge is calculated by Econt and displayed before the order is confirmed.'}</p>
        <p>{bg ? 'Други платежни методи могат да бъдат добавени в бъдеще и ще бъдат описани преди активирането им.' : 'Additional payment methods may be added later and will be described before they are enabled.'}</p>
      </section>

      <section>
        <h2>6. {bg ? 'Доставка, преглед и тест' : 'Delivery, review and test'}</h2>
        <p>{bg ? `Поръчките се подготвят обичайно в срок ${siteConfig.delivery.dispatchTimeBg}. Доставката се извършва чрез Еконт до избран офис или адрес в България. Срокът за транспорт зависи от услугата и маршрута на Еконт.` : `Orders are normally prepared within ${siteConfig.delivery.dispatchTimeEn}. Delivery is made by Econt to a selected office or address in Bulgaria. Transit time depends on Econt's service and route.`}</p>
        <p>{bg ? 'Пратките се подготвят с опция „Преглед и тест“, когато услугата е приложима. При отказ по време на прегледа/теста куриерът обработва връщането съгласно условията по пратката.' : 'Shipments are prepared with Econt “Review and test” where applicable. If the customer refuses the parcel during review/test, Econt processes the return under the shipment instructions.'}</p>
        <p><Link href="/delivery-returns">{bg ? 'Подробни условия за доставка и връщане' : 'Detailed delivery and return information'} →</Link></p>
      </section>

      <section>
        <h2>7. {bg ? 'Право на отказ и връщане' : 'Withdrawal and returns'}</h2>
        <p>{bg ? 'Потребителят има право в срок от 14 дни от получаването на стоката да се откаже от покупката и да върне продукта, когато не е приложимо законово изключение. Преди изпращане на връщане клиентът следва да се свърже с ГЕРПИНА по имейл или телефон и да получи указания.' : 'The customer has the right to withdraw from the purchase and return the product within 14 days of receiving it, unless a legal exception applies. Before sending a return, the customer should contact GERPINA by email or phone and obtain return instructions.'}</p>
        <p>{bg ? 'При нормален отказ разходите за връщане са за сметка на клиента. Ако е изпратен грешен или несъответстващ артикул по вина на ГЕРПИНА, разходите за връщането се поемат от ГЕРПИНА.' : 'For a normal change-of-mind return, return shipping is paid by the customer. Where GERPINA sent an incorrect or non-conforming item, GERPINA bears the return shipping cost.'}</p>
        <p>{bg ? 'Дрехата може да бъде пробвана само доколкото е необходимо за установяване на вид, характеристики и размер. При употреба или увреждане извън необходимото за такава проверка потребителят може да отговаря за намалената стойност.' : 'A garment may be tried only as necessary to establish its nature, characteristics and fit. Use or damage beyond what is necessary for that check may result in liability for diminished value.'}</p>
        <p>{bg ? 'Възстановяването на суми се извършва в съответствие с приложимото потребителско законодателство и конкретните указания, предоставени при заявеното връщане.' : 'Refunds are handled in accordance with applicable consumer law and the instructions provided for the specific return.'}</p>
      </section>

      <section>
        <h2>8. {bg ? 'Рекламации и несъответствие' : 'Complaints and non-conformity'}</h2>
        <p>{bg ? 'При проблем с получен артикул клиентът трябва да се свърже с ГЕРПИНА възможно най-скоро на посочените контакти, като посочи поръчката и проблема. Законовите права при несъответствие на стоката не се ограничават от настоящите условия.' : 'If there is a problem with an item, the customer should contact GERPINA as soon as possible, identifying the order and issue. Statutory rights relating to non-conforming goods are not limited by these Terms.'}</p>
      </section>

      <section>
        <h2>9. {bg ? 'Лични данни' : 'Personal data'}</h2>
        <p>{bg ? 'Личните данни се обработват съгласно Политиката за поверителност на магазина.' : 'Personal data is processed according to the store Privacy Policy.'} <Link href="/privacy">{bg ? 'Прочети политиката' : 'Read the policy'} →</Link></p>
      </section>

      <section>
        <h2>10. {bg ? 'Приложимо право и контакт' : 'Applicable law and contact'}</h2>
        <p>{bg ? 'Прилагат се действащите императивни норми на българското и европейското потребителско законодателство. Настоящите условия не ограничават права, които законът предоставя на потребителите.' : 'Mandatory Bulgarian and EU consumer-protection rules apply. These Terms do not restrict rights granted to consumers by law.'}</p>
        <p>{siteConfig.contact.email} · {siteConfig.contact.phone}</p>
      </section>
    </LegalPage>
  );
}
