'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';
import { TruckIcon } from '@/components/Icons';

export default function CheckoutPage() {
  const { language } = useLanguage();
  const { cart, cartTotal } = useStore();
  const [deliveryType, setDeliveryType] = useState('office');
  const [paymentType, setPaymentType] = useState('cod');
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  const copy = useMemo(() => language === 'bg' ? {
    eyebrow: 'СИГУРНА ПОРЪЧКА',
    title: 'Завърши поръчката',
    back: 'Назад към количката',
    contactTitle: '1. Данни за контакт',
    contactText: 'Използваме тези данни само за обработка и доставка на поръчката.',
    firstName: 'Име',
    lastName: 'Фамилия',
    phone: 'Телефон',
    email: 'Имейл',
    deliveryTitle: '2. Доставка с Еконт',
    deliveryText: 'Избери доставка до офис на Еконт или до адрес. Списъкът с офиси ще може да бъде свързан с Еконт API.',
    office: 'До офис на Еконт',
    officeSub: 'Избери град и офис',
    address: 'До адрес',
    addressSub: 'Куриер до посочен адрес',
    city: 'Град / населено място',
    officeField: 'Офис на Еконт',
    officePlaceholder: 'Еконт API / избор на офис предстои',
    street: 'Адрес',
    streetPlaceholder: 'Улица, номер, вход, етаж, апартамент',
    postcode: 'Пощенски код (по желание)',
    note: 'Бележка към поръчката (по желание)',
    notePlaceholder: 'Допълнителна информация за доставката',
    paymentTitle: '3. Плащане',
    cod: 'Наложен платеж при получаване',
    codSub: 'Плащане чрез Еконт при получаване на пратката.',
    paymentPending: 'Финалните условия за плащане ще бъдат потвърдени преди активиране на поръчките.',
    summary: 'Твоята поръчка',
    items: 'Продукти',
    delivery: 'Доставка',
    deliveryCalc: 'изчислява се от Еконт',
    total: 'Общо продукти',
    qty: 'бр.',
    place: 'Изпрати поръчката',
    demo: 'ДЕМО РЕЖИМ',
    demoBody: 'Формата е готова визуално. Изпращането по имейл и връзката с Еконт ще бъдат активирани след като потвърдим точния процес и контактните данни.',
    empty: 'Количката ти е празна',
    emptyText: 'Добави продукт, за да видиш пълния checkout процес.',
    shop: 'Към магазина',
    required: '* задължително поле',
  } : {
    eyebrow: 'SECURE CHECKOUT',
    title: 'Complete your order',
    back: 'Back to bag',
    contactTitle: '1. Contact details',
    contactText: 'We use these details only to process and deliver your order.',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone',
    email: 'Email',
    deliveryTitle: '2. Econt delivery',
    deliveryText: 'Choose delivery to an Econt office or an address. The office list can later be connected to the Econt API.',
    office: 'Econt office',
    officeSub: 'Choose city and office',
    address: 'To an address',
    addressSub: 'Courier delivery to your address',
    city: 'City / town',
    officeField: 'Econt office',
    officePlaceholder: 'Econt API / office selector coming next',
    street: 'Address',
    streetPlaceholder: 'Street, number, entrance, floor, apartment',
    postcode: 'Postcode (optional)',
    note: 'Order note (optional)',
    notePlaceholder: 'Additional delivery information',
    paymentTitle: '3. Payment',
    cod: 'Cash on delivery',
    codSub: 'Payment through Econt when the parcel is received.',
    paymentPending: 'Final payment terms will be confirmed before ordering is activated.',
    summary: 'Your order',
    items: 'Items',
    delivery: 'Delivery',
    deliveryCalc: 'calculated by Econt',
    total: 'Items total',
    qty: 'pcs',
    place: 'Place order',
    demo: 'DEMO MODE',
    demoBody: 'The checkout UI is ready. Email submission and the Econt connection will be activated once the exact process and contact details are confirmed.',
    empty: 'Your bag is empty',
    emptyText: 'Add a product to preview the complete checkout flow.',
    shop: 'Go to shop',
    required: '* required field',
  }, [language]);

  if (!cart.length) {
    return (
      <main className="checkout-page page-width">
        <div className="plain-heading checkout-heading">
          <span>{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
        </div>
        <div className="empty-state checkout-empty">
          <h2>{copy.empty}</h2>
          <p>{copy.emptyText}</p>
          <Link href="/shop">{copy.shop}</Link>
        </div>
      </main>
    );
  }

  function submitDemo(event) {
    event.preventDefault();
    setShowDemoNotice(true);
  }

  return (
    <main className="checkout-page page-width">
      <div className="checkout-topbar">
        <div className="plain-heading checkout-heading">
          <span>{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
        </div>
        <Link href="/cart" className="checkout-back">← {copy.back}</Link>
      </div>

      <form className="checkout-layout" onSubmit={submitDemo}>
        <div className="checkout-form-column">
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <div>
                <h2>{copy.contactTitle}</h2>
                <p>{copy.contactText}</p>
              </div>
              <span>{copy.required}</span>
            </div>
            <div className="checkout-fields two-col">
              <label>
                <span>{copy.firstName} *</span>
                <input required name="firstName" autoComplete="given-name" />
              </label>
              <label>
                <span>{copy.lastName} *</span>
                <input required name="lastName" autoComplete="family-name" />
              </label>
              <label>
                <span>{copy.phone} *</span>
                <input required name="phone" type="tel" autoComplete="tel" placeholder="+359 ..." />
              </label>
              <label>
                <span>{copy.email}</span>
                <input name="email" type="email" autoComplete="email" />
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <div>
                <h2>{copy.deliveryTitle}</h2>
                <p>{copy.deliveryText}</p>
              </div>
            </div>

            <div className="delivery-choice-grid">
              <button type="button" className={`delivery-choice ${deliveryType === 'office' ? 'active' : ''}`} onClick={() => setDeliveryType('office')}>
                <span className="delivery-radio" aria-hidden="true" />
                <TruckIcon size={30} />
                <span><b>{copy.office}</b><small>{copy.officeSub}</small></span>
              </button>
              <button type="button" className={`delivery-choice ${deliveryType === 'address' ? 'active' : ''}`} onClick={() => setDeliveryType('address')}>
                <span className="delivery-radio" aria-hidden="true" />
                <TruckIcon size={30} />
                <span><b>{copy.address}</b><small>{copy.addressSub}</small></span>
              </button>
            </div>

            <div className="checkout-fields delivery-fields">
              <label>
                <span>{copy.city} *</span>
                <input required name="city" autoComplete="address-level2" />
              </label>

              {deliveryType === 'office' ? (
                <label>
                  <span>{copy.officeField} *</span>
                  <select required name="econtOffice" defaultValue="">
                    <option value="" disabled>{copy.officePlaceholder}</option>
                    <option value="demo-office-1">Demo: Еконт офис 1</option>
                    <option value="demo-office-2">Demo: Еконт офис 2</option>
                  </select>
                  <small className="field-helper">API-ready placeholder</small>
                </label>
              ) : (
                <>
                  <label>
                    <span>{copy.street} *</span>
                    <input required name="address" autoComplete="street-address" placeholder={copy.streetPlaceholder} />
                  </label>
                  <label className="short-field">
                    <span>{copy.postcode}</span>
                    <input name="postcode" autoComplete="postal-code" />
                  </label>
                </>
              )}

              <label>
                <span>{copy.note}</span>
                <textarea name="note" rows="4" placeholder={copy.notePlaceholder} />
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <div><h2>{copy.paymentTitle}</h2></div>
            </div>
            <button type="button" className={`payment-choice ${paymentType === 'cod' ? 'active' : ''}`} onClick={() => setPaymentType('cod')}>
              <span className="delivery-radio" aria-hidden="true" />
              <span><b>{copy.cod}</b><small>{copy.codSub}</small></span>
            </button>
            <p className="payment-pending">{copy.paymentPending}</p>
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>{copy.summary}</h2>
          <div className="checkout-order-items">
            {cart.map((item) => (
              <div className="checkout-order-item" key={item.id}>
                <Link href={`/product/${item.slug}`} className="checkout-order-thumb">
                  <Image src={item.image} alt={item.name[language]} fill sizes="82px" />
                </Link>
                <div>
                  <small className="checkout-item-brand">{item.brand || 'GERPINA Selection'}</small>
                  <b>{item.name[language]}</b>
                  <span>{item.quantity} {copy.qty} × €{item.price.toFixed(2)}</span>
                </div>
                <strong>€{(item.quantity * item.price).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-lines">
            <div><span>{copy.items}</span><b>€{cartTotal.toFixed(2)}</b></div>
            <div><span>{copy.delivery}</span><b>{copy.deliveryCalc}</b></div>
            <div className="checkout-grand-total"><span>{copy.total}</span><strong>€{cartTotal.toFixed(2)}</strong></div>
          </div>

          <button className="place-order-button" type="submit">{copy.place}</button>
          <div className="checkout-demo-note">
            <b>{copy.demo}</b>
            <p>{copy.demoBody}</p>
          </div>
          {showDemoNotice && <div className="checkout-submit-notice" role="status">{copy.demoBody}</div>}
        </aside>
      </form>
    </main>
  );
}
