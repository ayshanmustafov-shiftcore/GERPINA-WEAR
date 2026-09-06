'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/components/StoreProvider';
import { TruckIcon } from '@/components/Icons';
import { siteConfig } from '@/data/site';

function cartPayload(cart) {
  return cart.map((item) => ({ id: item.id, quantity: item.quantity, selectedSize: item.selectedSize || null }));
}

function formatEcontExpectedDate(value, language) {
  if (value == null || value === '') return '';

  let date = null;
  const raw = String(value).trim();

  if (/^\d{11,}$/.test(raw)) {
    const numeric = Number(raw);
    date = new Date(numeric < 1e12 ? numeric * 1000 : numeric);
  } else {
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
    if (ymd) {
      date = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
    } else {
      const parsed = new Date(raw);
      if (!Number.isNaN(parsed.getTime())) date = parsed;
    }
  }

  if (!date || Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(language === 'bg' ? 'bg-BG' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Sofia',
  }).format(date);
}

export default function CheckoutPage() {
  const { language } = useLanguage();
  const { cart, cartTotal, clearCart } = useStore();
  const formRef = useRef(null);
  const [deliveryType, setDeliveryType] = useState('office');
  const [paymentType, setPaymentType] = useState('cod');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [contact, setContact] = useState({ firstName: '', lastName: '', phone: '', email: '' });

  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [cityError, setCityError] = useState('');

  const [offices, setOffices] = useState([]);
  const [officeCode, setOfficeCode] = useState('');
  const [officesLoading, setOfficesLoading] = useState(false);
  const [officeError, setOfficeError] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [submitState, setSubmitState] = useState({ loading: false, success: false, error: '', result: null });
  const [econtStatus, setEcontStatus] = useState({ loading: true, ready: false, createEnabled: false, error: '' });

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
    deliveryText: 'Градовете, офисите и цените се зареждат директно от Еконт.',
    office: 'До офис на Еконт',
    officeSub: 'Избери реален град и офис',
    address: 'До адрес',
    addressSub: 'Куриер до посочен адрес',
    city: 'Град / населено място',
    cityPlaceholder: 'Започни да пишеш, напр. София',
    cityHint: 'Избери населено място от резултатите на Еконт.',
    loadingCities: 'Търсене в Еконт…',
    noCities: 'Няма намерени населени места.',
    officeField: 'Офис на Еконт',
    officePlaceholder: 'Избери офис',
    loadingOffices: 'Зареждане на офиси…',
    noOffices: 'Няма намерени офиси за този град.',
    street: 'Адрес за доставка',
    deliveryAddress: 'Адрес за доставка',
    officeAddressHint: 'При доставка до офис това е адресът на избрания офис на Еконт. Не е необходим личен адрес.',
    streetPlaceholder: 'Улица, номер, вход, етаж, апартамент',
    note: 'Бележка към поръчката (по желание)',
    notePlaceholder: 'Допълнителна информация за доставката',
    recalculating: 'Еконт изчислява доставката…',
    autoCalculated: 'Доставката се изчислява автоматично.',
    autoWaiting: 'Цената ще се появи автоматично след попълване на данните за контакт и доставка.',
    quote: 'Цена от Еконт',
    paymentTitle: '3. Плащане',
    cod: 'Наложен платеж при получаване',
    codSub: 'Стойността на дрехите се плаща при получаване чрез Еконт.',
    shippingPayer: 'Клиентът заплаща и куриерската услуга при получаване.',
    reviewTest: 'Преглед и тест',
    reviewTestText: 'Пратката е подготвена с опция за преглед и тест преди окончателното приемане, когато услугата е приложима.',
    legalAgree: 'Прочетох и приемам Общите условия и Политиката за поверителност.',
    legalRequired: 'За да продължите, приемете Общите условия и Политиката за поверителност.',
    senderTitle: 'Изпращач',
    senderCompany: 'Фирма',
    senderOnBehalf: 'От името на',
    senderAddress: 'Офис за изпращане',
    senderHint: 'GERPINA предава готовите пратки в този офис на Еконт. Цената се изчислява като офис → офис или офис → адрес.',
    summary: 'Твоята поръчка',
    items: 'Продукти',
    delivery: 'Доставка с Еконт',
    deliveryCalc: 'изчислява се автоматично',
    itemsTotal: 'Общо продукти',
    payable: 'Общо при получаване',
    qty: 'бр.',
    place: 'Завърши поръчката',
    placing: 'Обработване на поръчката…',
    success: 'Поръчката е създадена успешно.',
    orderingDisabled: 'Онлайн поръчките временно не са активирани.',
    weightCheck: 'Преди предаване на пратката в Еконт провери реалното тегло и при необходимост коригирай товарителницата.',
    liveConnectionError: 'Връзката с Еконт не е готова. Провери Environment Variables или COD настройките.',
    empty: 'Количката ти е празна',
    emptyText: 'Добави продукт, за да продължиш към поръчка.',
    shop: 'Към магазина',
    required: '* задължително поле',
    chooseCity: 'Първо избери град от Еконт.',
    chooseOffice: 'Избери офис на Еконт.',
    enterAddress: 'Въведи адрес за доставка.',
    quoteFirst: 'Изчисли доставката преди финалната проверка.',
    apiError: 'Еконт не отговори. Опитай отново.',
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
    deliveryText: 'Cities, offices and delivery prices are loaded directly from Econt.',
    office: 'Econt office',
    officeSub: 'Choose a real city and office',
    address: 'To an address',
    addressSub: 'Courier delivery to your address',
    city: 'City / town',
    cityPlaceholder: 'Start typing, e.g. Sofia',
    cityHint: 'Select a location returned by Econt.',
    loadingCities: 'Searching Econt…',
    noCities: 'No locations found.',
    officeField: 'Econt office',
    officePlaceholder: 'Choose an office',
    loadingOffices: 'Loading offices…',
    noOffices: 'No offices found for this city.',
    street: 'Delivery address',
    deliveryAddress: 'Delivery address',
    officeAddressHint: 'For office delivery, this is the address of the selected Econt office. Your home address is not required.',
    streetPlaceholder: 'Street, number, entrance, floor, apartment',
    note: 'Order note (optional)',
    notePlaceholder: 'Additional delivery information',
    recalculating: 'Econt is calculating delivery…',
    autoCalculated: 'Delivery is calculated automatically.',
    autoWaiting: 'The price will appear automatically after the required contact and delivery details are complete.',
    quote: 'Econt delivery price',
    paymentTitle: '3. Payment',
    cod: 'Cash on delivery',
    codSub: 'The merchandise value is paid through Econt when the parcel is received.',
    shippingPayer: 'The customer also pays the courier fee on receipt.',
    reviewTest: 'Review and test',
    reviewTestText: 'The parcel is prepared with review and test before final acceptance where the service is applicable.',
    legalAgree: 'I have read and accept the Terms & Conditions and Privacy Policy.',
    legalRequired: 'Please accept the Terms & Conditions and Privacy Policy to continue.',
    senderTitle: 'Sender',
    senderCompany: 'Company',
    senderOnBehalf: 'On behalf of',
    senderAddress: 'Dispatch Econt office',
    senderHint: 'GERPINA hands prepared parcels in at this Econt office. Pricing is office → office or office → address.',
    summary: 'Your order',
    items: 'Items',
    delivery: 'Econt delivery',
    deliveryCalc: 'calculated automatically',
    itemsTotal: 'Items total',
    payable: 'Payable on receipt',
    qty: 'pcs',
    place: 'Place order',
    placing: 'Processing order…',
    success: 'Your order was created successfully.',
    orderingDisabled: 'Online ordering is temporarily unavailable.',
    weightCheck: 'Before handing the parcel to Econt, verify the actual weight and correct the waybill if necessary.',
    liveConnectionError: 'The Econt connection is not ready. Check the Environment Variables or COD configuration.',
    empty: 'Your bag is empty',
    emptyText: 'Add a product to continue to checkout.',
    shop: 'Go to shop',
    required: '* required field',
    chooseCity: 'Select a city from Econt first.',
    chooseOffice: 'Select an Econt office.',
    enterAddress: 'Enter a delivery address.',
    quoteFirst: 'Calculate delivery before the final validation.',
    apiError: 'Econt did not respond. Please try again.',
  }, [language]);

  useEffect(() => {
    let cancelled = false;
    async function loadEcontStatus() {
      try {
        const response = await fetch('/api/econt/status', { cache: 'no-store' });
        const data = await response.json();
        if (cancelled) return;
        setEcontStatus({
          loading: false,
          ready: Boolean(data.profileLoaded && data.senderReady && data.codReady),
          createEnabled: Boolean(data.createEnabled),
          error: data.error || '',
        });
      } catch (error) {
        if (!cancelled) setEcontStatus({ loading: false, ready: false, createEnabled: false, error: error.message || copy.apiError });
      }
    }
    loadEcontStatus();
    return () => { cancelled = true; };
  }, [copy.apiError]);

  useEffect(() => {
    if (selectedCity && (cityQuery === selectedCity.name || cityQuery === selectedCity.nameEn)) {
      setCityOptions([]);
      return;
    }

    if (cityQuery.trim().length < 2) {
      setCityOptions([]);
      setCityError('');
      return;
    }

    const timer = setTimeout(async () => {
      setCitiesLoading(true);
      setCityError('');
      try {
        const response = await fetch(`/api/econt/cities?q=${encodeURIComponent(cityQuery.trim())}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || copy.apiError);
        setCityOptions(data.cities || []);
      } catch (error) {
        setCityOptions([]);
        setCityError(error.message || copy.apiError);
      } finally {
        setCitiesLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cityQuery, selectedCity, copy.apiError]);

  useEffect(() => {
    if (!selectedCity || deliveryType !== 'office') {
      setOffices([]);
      setOfficeCode('');
      return;
    }

    let cancelled = false;
    async function loadOffices() {
      setOfficesLoading(true);
      setOfficeError('');
      try {
        const response = await fetch(`/api/econt/offices?cityId=${selectedCity.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || copy.apiError);
        if (!cancelled) setOffices(data.offices || []);
      } catch (error) {
        if (!cancelled) {
          setOffices([]);
          setOfficeError(error.message || copy.apiError);
        }
      } finally {
        if (!cancelled) setOfficesLoading(false);
      }
    }
    loadOffices();
    return () => { cancelled = true; };
  }, [selectedCity, deliveryType, copy.apiError]);

  useEffect(() => {
    setQuote(null);
    setQuoteError('');
    setSubmitState({ loading: false, success: false, error: '', result: null });
  }, [deliveryType, selectedCity, officeCode, address, cartTotal, contact.firstName, contact.lastName, contact.phone]);

  // Econt delivery is calculated automatically once the required contact and destination fields are complete.
  useEffect(() => {
    if (!cart.length || econtStatus.loading) return;
    if (!econtStatus.ready) return;

    const receiverReady = Boolean(
      contact.firstName.trim() &&
      contact.lastName.trim() &&
      contact.phone.replace(/[^+\d]/g, '').length >= 7
    );
    const destinationReady = Boolean(
      selectedCity &&
      ((deliveryType === 'office' && officeCode) || (deliveryType === 'address' && address.trim().length >= 3))
    );

    if (!receiverReady || !destinationReady) return;

    const timer = setTimeout(() => {
      calculateDelivery({ silent: true });
    }, deliveryType === 'address' ? 700 : 350);

    return () => clearTimeout(timer);
  }, [
    cart.length,
    cartTotal,
    econtStatus.loading,
    econtStatus.ready,
    contact.firstName,
    contact.lastName,
    contact.phone,
    selectedCity,
    deliveryType,
    officeCode,
    address,
  ]);

  if (submitState.success && submitState.result) {
    return (
      <main className="checkout-page page-width">
        <div className="plain-heading checkout-heading">
          <span>{copy.eyebrow}</span>
          <h1>{copy.success}</h1>
        </div>
        <div className="checkout-submit-notice success order-result order-confirmation-page" role="status">
          <span>{language === 'bg' ? 'Поръчка' : 'Order'}: <b>{submitState.result.orderNumber}</b></span>
          <span>{language === 'bg' ? 'Товарителница Еконт' : 'Econt waybill'}: <b>{submitState.result.shipmentNumber}</b></span>
          {formatEcontExpectedDate(submitState.result.expectedDeliveryDate, language) && (
            <span>{language === 'bg' ? 'Очаквана доставка' : 'Expected delivery'}: {formatEcontExpectedDate(submitState.result.expectedDeliveryDate, language)}</span>
          )}
          {submitState.result.pdfURL && (
            <a href={submitState.result.pdfURL} target="_blank" rel="noreferrer">
              {language === 'bg' ? 'Отвори товарителницата' : 'Open waybill'}
            </a>
          )}
          <Link href="/shop">{language === 'bg' ? 'Продължи към магазина' : 'Continue shopping'}</Link>
        </div>
      </main>
    );
  }

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

  function chooseCity(city) {
    setSelectedCity(city);
    setCityQuery(language === 'bg' ? city.name : (city.nameEn || city.name));
    setCityOptions([]);
    setOfficeCode('');
    setQuote(null);
  }

  function changeCityQuery(value) {
    setCityQuery(value);
    if (!selectedCity || (value !== selectedCity.name && value !== selectedCity.nameEn)) {
      setSelectedCity(null);
      setOfficeCode('');
      setOffices([]);
      setQuote(null);
    }
  }

  function getReceiver() {
    return {
      name: `${contact.firstName} ${contact.lastName}`.trim(),
      phone: contact.phone,
      email: contact.email.trim() || null,
    };
  }

  function makeEcontPayload() {
    return {
      items: cartPayload(cart),
      deliveryType,
      city: selectedCity,
      officeCode: deliveryType === 'office' ? officeCode : null,
      office: deliveryType === 'office' && selectedOffice ? selectedOffice : null,
      address: deliveryType === 'address' ? address : null,
      receiver: getReceiver(),
      note: note.trim() || null,
      quotedShippingPrice: typeof quote?.shippingPrice === 'number' ? quote.shippingPrice : null,
    };
  }

  function deliveryValidationMessage() {
    if (!selectedCity) return copy.chooseCity;
    if (deliveryType === 'office' && !officeCode) return copy.chooseOffice;
    if (deliveryType === 'address' && address.trim().length < 3) return copy.enterAddress;
    return '';
  }

  async function calculateDelivery({ silent = false } = {}) {
    const validation = deliveryValidationMessage();
    if (validation) {
      if (!silent) setQuoteError(validation);
      return false;
    }

    setQuoteLoading(true);
    setQuoteError('');
    setSubmitState({ loading: false, success: false, error: '', result: null });
    try {
      const response = await fetch('/api/econt/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(makeEcontPayload()),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || copy.apiError);
      setQuote(data);
      return true;
    } catch (error) {
      setQuote(null);
      setQuoteError(error.message || copy.apiError);
      return false;
    } finally {
      setQuoteLoading(false);
    }
  }

  async function submitOrder(event) {
    event.preventDefault();
    setSubmitState({ loading: false, success: false, error: '', result: null });

    const validation = deliveryValidationMessage();
    if (validation) {
      setSubmitState({ loading: false, success: false, error: validation, result: null });
      return;
    }

    if (!legalAccepted) {
      setSubmitState({ loading: false, success: false, error: copy.legalRequired, result: null });
      return;
    }

    if (!quote) {
      const calculated = await calculateDelivery({ silent: false });
      if (!calculated) return;
    }

    setSubmitState({ loading: true, success: false, error: '', result: null });
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(makeEcontPayload()),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || copy.apiError);
      setSubmitState({ loading: false, success: true, error: '', result: data });
      clearCart();
    } catch (error) {
      setSubmitState({ loading: false, success: false, error: error.message || copy.apiError, result: null });
    }
  }

  const selectedOffice = officeCode ? offices.find((office) => String(office.code) === String(officeCode)) : null;

  const shippingPrice = quote?.shippingPrice ?? null;
  const payableOnDelivery = quote?.payableOnDelivery ?? cartTotal;

  return (
    <main className="checkout-page page-width">
      <div className="checkout-topbar">
        <div className="plain-heading checkout-heading">
          <span>{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
        </div>
        <Link href="/cart" className="checkout-back">← {copy.back}</Link>
      </div>

      <form ref={formRef} className="checkout-layout" onSubmit={submitOrder}>
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
                <input required name="firstName" autoComplete="given-name" value={contact.firstName} onChange={(event) => setContact((current) => ({ ...current, firstName: event.target.value }))} />
              </label>
              <label>
                <span>{copy.lastName} *</span>
                <input required name="lastName" autoComplete="family-name" value={contact.lastName} onChange={(event) => setContact((current) => ({ ...current, lastName: event.target.value }))} />
              </label>
              <label>
                <span>{copy.phone} *</span>
                <input required name="phone" type="tel" autoComplete="tel" placeholder="+359 ..." value={contact.phone} onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))} />
              </label>
              <label>
                <span>{copy.email}</span>
                <input name="email" type="email" autoComplete="email" value={contact.email} onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))} />
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading econt-heading-row">
              <div>
                <h2>{copy.deliveryTitle}</h2>
                <p>{copy.deliveryText}</p>
              </div>
            </div>

            {econtStatus.ready && (
              <div className="econt-profile-confirmation">
                <b>{language === 'bg' ? 'Еконт е свързан' : 'Econt connected'}</b>
                <span>{language === 'bg' ? 'Доставката и товарителницата се обработват директно през Еконт.' : 'Delivery and waybill processing are connected directly to Econt.'}</span>
              </div>
            )}

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
              <label className="econt-city-field">
                <span>{copy.city} *</span>
                <div className="econt-autocomplete">
                  <input
                    required
                    name="citySearch"
                    autoComplete="off"
                    value={cityQuery}
                    onChange={(event) => changeCityQuery(event.target.value)}
                    placeholder={copy.cityPlaceholder}
                  />
                  {!selectedCity && cityQuery.trim().length >= 2 && (
                    <div className="econt-suggestions" role="listbox">
                      {citiesLoading && <div className="econt-suggestion-status">{copy.loadingCities}</div>}
                      {!citiesLoading && cityError && <div className="econt-suggestion-status error">{cityError}</div>}
                      {!citiesLoading && !cityError && cityOptions.map((city) => (
                        <button key={city.id} type="button" onClick={() => chooseCity(city)}>
                          <b>{language === 'bg' ? city.name : (city.nameEn || city.name)}</b>
                          <span>{city.postCode}{city.regionName ? ` · ${language === 'bg' ? city.regionName : (city.regionNameEn || city.regionName)}` : ''}</span>
                        </button>
                      ))}
                      {!citiesLoading && !cityError && !cityOptions.length && <div className="econt-suggestion-status">{copy.noCities}</div>}
                    </div>
                  )}
                </div>
                <small className={selectedCity ? 'field-helper success' : 'field-note'}>
                  {selectedCity ? `Econt ID ${selectedCity.id} · ${selectedCity.postCode || ''}` : copy.cityHint}
                </small>
              </label>

              {deliveryType === 'office' ? (
                <>
                  <label>
                    <span>{copy.officeField} *</span>
                    <select required name="econtOffice" value={officeCode} onChange={(event) => setOfficeCode(event.target.value)} disabled={!selectedCity || officesLoading}>
                      <option value="">{officesLoading ? copy.loadingOffices : copy.officePlaceholder}</option>
                      {offices.map((office) => (
                        <option key={office.code} value={office.code}>
                          {language === 'bg' ? office.name : (office.nameEn || office.name)}{office.address ? ` — ${office.address}` : ''}
                        </option>
                      ))}
                    </select>
                    {!officesLoading && selectedCity && !offices.length && !officeError && <small className="field-note">{copy.noOffices}</small>}
                    {officeError && <small className="field-error">{officeError}</small>}
                  </label>
                  {selectedOffice?.address && (
                    <label className="econt-office-address">
                      <span>{copy.deliveryAddress}</span>
                      <input value={selectedOffice.address} readOnly aria-readonly="true" />
                      <small className="field-note">{copy.officeAddressHint}</small>
                    </label>
                  )}
                </>
              ) : (
                <label>
                  <span>{copy.street} *</span>
                  <input required name="address" autoComplete="street-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder={copy.streetPlaceholder} />
                </label>
              )}

              <label>
                <span>{copy.note}</span>
                <textarea name="note" rows="4" placeholder={copy.notePlaceholder} value={note} onChange={(event) => setNote(event.target.value)} />
              </label>
            </div>

            <div className="econt-auto-row">
              <div className={`econt-auto-status ${quoteLoading ? 'loading' : quote ? 'ready' : ''}`} role="status">
                <b>{quoteLoading ? copy.recalculating : quote ? copy.autoCalculated : copy.autoWaiting}</b>
              </div>
            </div>

            {quoteError && <div className="econt-api-message error" role="alert">{quoteError}</div>}
            {quote && (
              <div className="econt-quote-card" role="status">
                <div>
                  <span>{copy.quote}</span>
                  <strong>€{quote.shippingPrice.toFixed(2)}</strong>
                </div>
                {formatEcontExpectedDate(quote.expectedDeliveryDate, language) && (
                  <small>{language === 'bg' ? 'Очаквана доставка' : 'Expected delivery'}: {formatEcontExpectedDate(quote.expectedDeliveryDate, language)}</small>
                )}
                {quote.warnings && <small>{quote.warnings}</small>}
              </div>
            )}
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <div><h2>{copy.paymentTitle}</h2></div>
            </div>
            <button type="button" className={`payment-choice ${paymentType === 'cod' ? 'active' : ''}`} onClick={() => setPaymentType('cod')}>
              <span className="delivery-radio" aria-hidden="true" />
              <span><b>{copy.cod}</b><small>{copy.codSub}</small></span>
            </button>
            <p className="payment-pending">{copy.shippingPayer}</p>
            <div className="review-test-note"><b>{copy.reviewTest}</b><span>{copy.reviewTestText}</span></div>
          </section>


        </div>

        <aside className="checkout-summary">
          <div className="checkout-summary-title-row">
            <h2>{copy.summary}</h2>
          </div>
          <div className="checkout-order-items">
            {cart.map((item) => (
              <div className="checkout-order-item" key={item.cartKey || item.id}>
                <Link href={`/product/${item.slug}`} className="checkout-order-thumb">
                  {item.image ? <Image src={item.image} alt={item.name[language]} fill sizes="82px" /> : <div className="mini-image-placeholder"><b>GERPINA</b></div>}
                </Link>
                <div>
                  <small className="checkout-item-brand">{item.brand || 'GERPINA Selection'}</small>
                  <b>{item.name[language]}</b>
                  <span>{item.selectedSize ? `${language === 'bg' ? 'Размер' : 'Size'}: ${item.selectedSize} · ` : ''}{item.quantity} {copy.qty} × €{item.price.toFixed(2)}</span>
                </div>
                <strong>€{(item.quantity * item.price).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-lines">
            <div><span>{copy.items}</span><b>€{cartTotal.toFixed(2)}</b></div>
            <div><span>{copy.delivery}</span><b className={shippingPrice === null ? 'summary-action-text' : ''}>{quoteLoading ? copy.recalculating : shippingPrice === null ? copy.deliveryCalc : `€${shippingPrice.toFixed(2)}`}</b></div>
            <div><span>{copy.itemsTotal}</span><b>€{cartTotal.toFixed(2)}</b></div>
            <div className="checkout-grand-total"><span>{copy.payable}</span><strong>€{payableOnDelivery.toFixed(2)}</strong></div>
          </div>

          <label className="checkout-legal-consent"><input type="checkbox" checked={legalAccepted} onChange={(event) => setLegalAccepted(event.target.checked)} /><span>{language === 'bg' ? 'Прочетох и приемам ' : 'I have read and accept '}<Link href="/terms" target="_blank">{language === 'bg' ? 'Общите условия' : 'Terms & Conditions'}</Link>{language === 'bg' ? ' и ' : ' and '}<Link href="/privacy" target="_blank">{language === 'bg' ? 'Политиката за поверителност' : 'Privacy Policy'}</Link>.</span></label>

          <button className="place-order-button" type="submit" disabled={submitState.loading || econtStatus.loading || !econtStatus.ready || !econtStatus.createEnabled}>
            {submitState.loading ? copy.placing : copy.place}
          </button>
          {!econtStatus.loading && (!econtStatus.ready || !econtStatus.createEnabled) && (
            <div className="checkout-order-status-note">
              <b>{!econtStatus.ready ? copy.liveConnectionError : copy.orderingDisabled}</b>
              {econtStatus.error && <p className="checkout-econt-warning">{econtStatus.error}</p>}
            </div>
          )}
          {submitState.success && submitState.result && (
            <div className="checkout-submit-notice success order-result" role="status">
              <b>{copy.success}</b>
              <span>{language === 'bg' ? 'Поръчка' : 'Order'}: {submitState.result.orderNumber}</span>
              <span>{language === 'bg' ? 'Товарителница Еконт' : 'Econt waybill'}: {submitState.result.shipmentNumber}</span>
              <span><b>{copy.weightCheck}</b></span>
              {submitState.result.pdfURL && (
                <a href={submitState.result.pdfURL} target="_blank" rel="noreferrer">
                  {language === 'bg' ? 'Отвори товарителницата' : 'Open waybill'}
                </a>
              )}
            </div>
          )}
          {submitState.error && <div className="checkout-submit-notice error" role="alert">{submitState.error}</div>}
        </aside>
      </form>
    </main>
  );
}
