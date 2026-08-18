'use client';

import LegalPage from '@/components/LegalPage';
import { useLanguage } from '@/components/LanguageProvider';
import { siteConfig } from '@/data/site';

export default function DeliveryReturnsPage() {
  const { language } = useLanguage();
  const bg = language === 'bg';
  return (
    <LegalPage
      eyebrow={bg ? 'ПОМОЩ ПРИ ПОРЪЧКА' : 'ORDER HELP'}
      title={bg ? 'Доставка и връщане' : 'Delivery & Returns'}
      intro={bg ? 'Кратки и ясни правила за доставка с Еконт, „Преглед и тест“ и връщане в 14-дневен срок.' : 'Clear information about Econt delivery, review & test and the 14-day withdrawal period.'}
    >
      <section className="legal-highlight"><h2>{bg ? 'Доставка' : 'Delivery'}</h2><p>{bg ? `Поръчките се подготвят за изпращане в рамките на ${siteConfig.delivery.dispatchTimeBg}. Доставяме в България чрез Еконт – до офис или до адрес, избран от клиента при поръчката.` : `Orders are prepared within ${siteConfig.delivery.dispatchTimeEn}. Delivery in Bulgaria is handled by Econt to the office or address selected at checkout.`}</p><p>{bg ? 'Цената за доставка се изчислява автоматично от системата на Еконт според избраната дестинация и параметрите на пратката и се показва в checkout преди потвърждение.' : 'The delivery price is calculated automatically by Econt according to the destination and shipment details and is shown before checkout confirmation.'}</p></section>

      <section><h2>{bg ? 'Преглед и тест при получаване' : 'Review and test on delivery'}</h2><p>{bg ? 'Пратките се изпращат с опция „Преглед и тест“, когато услугата е приложима. Можете да отворите пратката и да пробвате дрехата пред куриера/в офиса преди окончателно приемане.' : 'Shipments are sent with Econt “Review and test” where applicable. You may open the parcel and try the garment in front of the courier/at the office before finally accepting it.'}</p><p>{bg ? 'Ако откажете пратката след преглед/тест, Еконт отбелязва отказа и организира връщането. При нормален отказ куриерските разходи за изпращане и връщане са за сметка на клиента, освен ако причината е грешен или несъответстващ артикул по вина на ГЕРПИНА.' : 'If you refuse the parcel after review/test, Econt records the refusal and handles the return. For a normal refusal, outgoing and return courier charges are paid by the customer, unless GERPINA sent an incorrect or non-conforming item.'}</p></section>

      <section><h2>{bg ? 'Връщане след като сте приели пратката' : 'Return after accepting the parcel'}</h2><p>{bg ? 'Имате право да уведомите ГЕРПИНА за отказ от дистанционната покупка в 14-дневен срок от получаването на стоката, когато не е приложимо законово изключение.' : 'You may notify GERPINA of withdrawal from a distance purchase within 14 days of receiving the goods, unless a legal exception applies.'}</p><div className="return-steps"><div><b>1</b><p>{bg ? `Свържете се с нас на ${siteConfig.contact.email} или ${siteConfig.contact.phone} и посочете поръчката и артикула.` : `Contact us at ${siteConfig.contact.email} or ${siteConfig.contact.phone} and identify the order and item.`}</p></div><div><b>2</b><p>{bg ? 'Изчакайте указанията ни за връщане чрез Еконт. Не изпращайте пратка обратно без предварителна уговорка.' : 'Wait for our Econt return instructions. Do not send a parcel back without contacting us first.'}</p></div><div><b>3</b><p>{bg ? 'При обикновено връщане разходът за обратната куриерска услуга е за клиента. При грешен/несъответстващ артикул по вина на ГЕРПИНА – за ГЕРПИНА.' : 'For a normal return, return courier cost is paid by the customer. For an incorrect/non-conforming item caused by GERPINA, GERPINA pays it.'}</p></div></div></section>

      <section><h2>{bg ? 'Състояние на върнатата дреха' : 'Condition of returned garments'}</h2><p>{bg ? 'Дрехата може да бъде пробвана, за да се установят размерът, видът и характеристиките ѝ. Не трябва да бъде носена повече от необходимото за проба, прана, замърсена, умишлено повредена или изменена. Етикетите и принадлежностите следва да бъдат запазени, когато са били налични.' : 'A garment may be tried to establish fit, appearance and characteristics. It must not be worn beyond what is necessary for fitting, washed, soiled, intentionally damaged or altered. Tags and accessories should be retained where supplied.'}</p></section>

      <section><h2>{bg ? 'Възстановяване на суми' : 'Refunds'}</h2><p>{bg ? 'След като се свържете с нас, ще получите конкретни инструкции за връщането и възстановяването. Методът за възстановяване се урежда според приложимото законодателство и конкретната поръчка. ГЕРПИНА не изисква от клиентите да въвеждат банкови данни в сайта.' : 'After contacting us, you will receive specific return and refund instructions. The refund method is handled according to applicable law and the specific order. GERPINA does not ask customers to enter bank details on the website.'}</p></section>

      <section><h2>{bg ? 'Адрес/офис за връщане' : 'Return office'}</h2><p>{bg ? 'Връщанията се координират предварително и се насочват към определения офис на Еконт:' : 'Returns are coordinated in advance and directed to the designated Econt office:'}</p><p><b>{siteConfig.delivery.office[language]}</b></p><p><b>{bg ? 'Важно:' : 'Important:'}</b> {bg ? 'първо се свържете с нас. Не изпращайте пратка без предварителни указания.' : 'contact us first. Do not send a return without prior instructions.'}</p></section>

      <section><h2>{bg ? 'Кратко уведомление за отказ' : 'Simple withdrawal notice'}</h2><p>{bg ? 'Не е необходимо да посочвате причина за законов отказ. Можете да изпратите имейл с текст от типа:' : 'You do not have to provide a reason for a statutory withdrawal. You may email a clear statement such as:'}</p><blockquote>{bg ? '„Уведомявам Ви, че се отказвам от договор за покупка на [артикул], поръчка [номер], получена на [дата]. Име: [име]. Телефон: [телефон].“' : '“I notify you that I withdraw from the purchase of [item], order [number], received on [date]. Name: [name]. Phone: [phone].”'}</blockquote></section>
    </LegalPage>
  );
}
