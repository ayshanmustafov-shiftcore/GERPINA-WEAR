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

export default function CheckoutPage() {
  const { language } = useLanguage();
  const { cart, cartTotal } = useStore();
  const formRef = useRef(null);
  const [deliveryType, setDeliveryType] = useState('office');
  const [paymentType, setPaymentType] = useState('cod');
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

  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [submitState, setSubmitState] = useState({ loading: false, success: false, error: '' });
  const [econtStatus, setEcontStatus] = useState({ loading: true, mode: null, safeMode: true, ready: false, error: '', profileName: '', clientNumber: '', agreement: '' });

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
    deliveryTextTest: 'Градовете и офисите се зареждат директно от тестовата система на Еконт.',
    deliveryTextLive: 'Градовете, офисите и цените се зареждат директно от реалната система на Еконт. Създаването на товарителници е изключено.',
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
    quoteTest: 'Тестова цена от Еконт',
    quoteLive: 'Реална цена от Еконт',
    quoteWeight: 'Демо тегло',
    quoteWeightInfo: '0,5 кг на артикул до получаване на реалните тегла.',
    paymentTitle: '3. Плащане',
    cod: 'Наложен платеж при получаване',
    codSub: 'Стойността на дрехите се плаща при получаване чрез Еконт.',
    shippingPayer: 'Клиентът заплаща и куриерската услуга при получаване.',
    senderTitle: 'Изпращач',
    senderCompany: 'Фирма',
    senderOnBehalf: 'От името на',
    senderAddress: 'Адрес за изпращане',
    senderHint: 'Това е адресът, от който GERPINA предава пратките на Еконт.',
    summary: 'Твоята поръчка',
    items: 'Продукти',
    delivery: 'Доставка с Еконт',
    deliveryCalc: 'изчислява се автоматично',
    itemsTotal: 'Общо продукти',
    payable: 'Общо при получаване',
    qty: 'бр.',
    place: 'Провери поръчката с Еконт',
    placing: 'Проверка с Еконт…',
    demo: 'ECONT TEST MODE',
    liveSafe: 'ECONT LIVE · SAFE MODE',
    demoBody: 'Това е връзка към тестовата API среда на Еконт. Не се създава реална товарителница и не се заявява куриер.',
    liveSafeBody: 'Свързано е с реалния e-Econt акаунт на GERPINA за профил, градове, офиси, цени и валидиране. Този build няма функция за създаване на товарителница или заявка за куриер.',
    successTest: 'Данните са валидирани успешно от тестовата система на Еконт. Не е създадена реална пратка.',
    successLive: 'Еконт валидира данните успешно през реалния акаунт. Не е създадена товарителница и не е заявен куриер.',
    liveConnectionError: 'Реалният Econt акаунт не е готов за безопасно валидиране. Провери Environment Variables или COD настройките.',
    empty: 'Количката ти е празна',
    emptyText: 'Добави продукт, за да видиш пълния checkout процес.',
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
    deliveryTextTest: 'Cities and offices are loaded directly from Econt’s test environment.',
    deliveryTextLive: 'Cities, offices and prices are loaded directly from Econt production. Waybill creation is disabled.',
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
    quoteTest: 'Test price from Econt',
    quoteLive: 'Live price from Econt',
    quoteWeight: 'Demo weight',
    quoteWeightInfo: '0.5 kg per item until real garment weights are available.',
    paymentTitle: '3. Payment',
    cod: 'Cash on delivery',
    codSub: 'The merchandise value is paid through Econt when the parcel is received.',
    shippingPayer: 'The customer also pays the courier fee on receipt.',
    senderTitle: 'Sender',
    senderCompany: 'Company',
    senderOnBehalf: 'On behalf of',
    senderAddress: 'Dispatch address',
    senderHint: 'This is the address from which GERPINA hands parcels over to Econt.',
    summary: 'Your order',
    items: 'Items',
    delivery: 'Econt delivery',
    deliveryCalc: 'calculated automatically',
    itemsTotal: 'Items total',
    payable: 'Payable on receipt',
    qty: 'pcs',
    place: 'Validate order with Econt',
    placing: 'Validating with Econt…',
    demo: 'ECONT TEST MODE',
    liveSafe: 'ECONT LIVE · SAFE MODE',
    demoBody: 'This connects to Econt’s test API. No real waybill is created and no courier is requested.',
    liveSafeBody: 'Connected to GERPINA’s real e-Econt account for profile, cities, offices, prices and validation. This build has no function that can create a waybill or request a courier.',
    successTest: 'The checkout data was successfully validated by Econt’s test environment. No real shipment was created.',
    successLive: 'Econt validated the data through the live account. No waybill was created and no courier was requested.',
    liveConnectionError: 'The live Econt account is not ready for safe validation. Check the Environment Variables or COD configuration.',
    empty: 'Your bag is empty',
    emptyText: 'Add a product to preview the complete checkout flow.',
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
          mode: data.mode || null,
          safeMode: data.safeMode !== false,
          ready: Boolean(data.profileLoaded && data.senderReady && data.codReady),
          error: data.error || '',
          profileName: data.selectedProfileName || '',
          clientNumber: data.selectedClientNumber || '',
          agreement: data.configuredAgreement || '',
        });
      } catch (error) {
        if (!cancelled) setEcontStatus({ loading: false, mode: null, safeMode: true, ready: false, error: error.message || copy.apiError, profileName: '', clientNumber: '', agreement: '' });
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
    setSubmitState({ loading: false, success: false, error: '' });
  }, [deliveryType, selectedCity, officeCode, address, cartTotal, contact.firstName, contact.lastName, contact.phone]);

  // Econt delivery is intentionally automatic. Once the required contact + destination
  // fields are complete, wait briefly for the user to finish typing and request a safe
  // calculate-only quote. No shipment can be created by this effect.
  useEffect(() => {
    if (!cart.length || econtStatus.loading) return;
    if (econtStatus.mode === 'production' && !econtStatus.ready) return;

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
    econtStatus.mode,
    econtStatus.ready,
    contact.firstName,
    contact.lastName,
    contact.phone,
    selectedCity,
    deliveryType,
    officeCode,
    address,
  ]);

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
    };
  }

  function makeEcontPayload() {
    return {
      items: cartPayload(cart),
      deliveryType,
      city: selectedCity,
      officeCode: deliveryType === 'office' ? officeCode : null,
      address: deliveryType === 'address' ? address : null,
      receiver: getReceiver(),
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
    setSubmitState({ loading: false, success: false, error: '' });
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

  async function submitTest(event) {
    event.preventDefault();
    setSubmitState({ loading: false, success: false, error: '' });

    const validation = deliveryValidationMessage();
    if (validation) {
      setSubmitState({ loading: false, success: false, error: validation });
      return;
    }

    if (!quote) {
      const calculated = await calculateDelivery({ silent: false });
      if (!calculated) return;
    }

    setSubmitState({ loading: true, success: false, error: '' });
    try {
      const response = await fetch('/api/econt/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(makeEcontPayload()),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || copy.apiError);
      setQuote(data);
      setSubmitState({ loading: false, success: true, error: '' });
    } catch (error) {
      setSubmitState({ loading: false, success: false, error: error.message || copy.apiError });
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

      <form ref={formRef} className="checkout-layout" onSubmit={submitTest}>
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
                <p>{econtStatus.mode === 'production' ? copy.deliveryTextLive : copy.deliveryTextTest}</p>
              </div>
              <span className={`econt-live-badge ${econtStatus.mode === 'production' ? 'production' : ''}`}>{econtStatus.mode === 'production' ? 'ECONT · LIVE SAFE' : 'ECONT · TEST API'}</span>
            </div>

            {econtStatus.ready && econtStatus.mode === 'production' && (
              <div className="econt-profile-confirmation">
                <b>{language === 'bg' ? 'Свързан Econt профил' : 'Connected Econt profile'}</b>
                <span>{language === 'bg' ? 'GERPINA WEAR · активна връзка' : 'GERPINA WEAR · connection active'}</span>
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
                <textarea name="note" rows="4" placeholder={copy.notePlaceholder} />
              </label>
            </div>

            <div className="econt-auto-row">
              <div className={`econt-auto-status ${quoteLoading ? 'loading' : quote ? 'ready' : ''}`} role="status">
                <b>{quoteLoading ? copy.recalculating : quote ? copy.autoCalculated : copy.autoWaiting}</b>
              </div>
              <div className="econt-weight-note">
                <b>{copy.quoteWeight}</b>
                <span>{quote?.shipmentWeightKg ? `${quote.shipmentWeightKg.toFixed(2)} kg · ` : ''}{copy.quoteWeightInfo}</span>
              </div>
            </div>

            {quoteError && <div className="econt-api-message error" role="alert">{quoteError}</div>}
            {quote && (
              <div className="econt-quote-card" role="status">
                <div>
                  <span>{econtStatus.mode === 'production' ? copy.quoteLive : copy.quoteTest}</span>
                  <strong>€{quote.shippingPrice.toFixed(2)}</strong>
                </div>
                {quote.expectedDeliveryDate && <small>{language === 'bg' ? 'Очаквана дата' : 'Expected date'}: {quote.expectedDeliveryDate}</small>}
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
          </section>

          <section className="checkout-section sender-section">
            <div className="checkout-section-heading">
              <div>
                <h2>{copy.senderTitle}</h2>
                <p>{copy.senderHint}</p>
              </div>
            </div>
            <div className="sender-info-card">
              <div>
                <span>{copy.senderCompany}</span>
                <strong>{siteConfig.sender.company[language]}</strong>
              </div>
              <div>
                <span>{copy.senderOnBehalf}</span>
                <strong>{siteConfig.sender.agent[language]}</strong>
              </div>
              <div className="sender-address-line">
                <span>{copy.senderAddress}</span>
                <strong>{siteConfig.sender.address[language]}</strong>
              </div>
            </div>
          </section>
        </div>

        <aside className="checkout-summary">
          <div className="checkout-summary-title-row">
            <h2>{copy.summary}</h2>
            <span className={`summary-test-pill ${econtStatus.mode === 'production' ? 'production' : ''}`}>{econtStatus.mode === 'production' ? 'SAFE LIVE' : 'TEST'}</span>
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

          <button className="place-order-button" type="submit" disabled={submitState.loading || (econtStatus.mode === 'production' && !econtStatus.ready)}>
            {submitState.loading ? copy.placing : copy.place}
          </button>
          <div className="checkout-demo-note">
            <b>{econtStatus.mode === 'production' ? copy.liveSafe : copy.demo}</b>
            <p>{econtStatus.mode === 'production' ? copy.liveSafeBody : copy.demoBody}</p>
            {econtStatus.mode === 'production' && !econtStatus.loading && !econtStatus.ready && (
              <p className="checkout-econt-warning">{econtStatus.error || copy.liveConnectionError}</p>
            )}
          </div>
          {submitState.success && <div className="checkout-submit-notice success" role="status">{econtStatus.mode === 'production' ? copy.successLive : copy.successTest}</div>}
          {submitState.error && <div className="checkout-submit-notice error" role="alert">{submitState.error}</div>}
        </aside>
      </form>
    </main>
  );
}
