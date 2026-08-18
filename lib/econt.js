import { products } from '@/data/products';

const DEMO_BASE_URL = 'https://demo.econt.com/ee/services';
const PRODUCTION_BASE_URL = 'https://ee.econt.com/services';
const DEMO_USERNAME = 'iasp-dev';
const DEMO_PASSWORD = '1Asp-dev';
const PROFILE_CACHE_MS = 5 * 60 * 1000;

let profileCache = null;
let profileCacheAt = 0;
let senderOfficeCache = null;
let senderOfficeCacheKey = '';
let senderOfficeCacheAt = 0;

export function getEcontConfig() {
  const mode = process.env.ECONT_ENV === 'production' ? 'production' : 'test';
  const isProduction = mode === 'production';

  return {
    mode,
    isProduction,
    // Production calls remain calculate/validate only. Test-order creation is isolated to Econt DEMO.
    safeMode: true,
    baseUrl: isProduction ? PRODUCTION_BASE_URL : DEMO_BASE_URL,
    username: process.env.ECONT_USERNAME || (isProduction ? '' : DEMO_USERNAME),
    password: process.env.ECONT_PASSWORD || (isProduction ? '' : DEMO_PASSWORD),
    cdAgreement: String(process.env.ECONT_CD_AGREEMENT || '').trim(),
    cdPayOptionsTemplate: String(process.env.ECONT_CD_PAY_TEMPLATE || '').trim(),
    preferredClientNumber: String(process.env.ECONT_PROFILE_CLIENT_NUMBER || '').trim(),
    senderOfficeCode: String(process.env.ECONT_SENDER_OFFICE_CODE || '').trim(),

    // GERPINA hands parcels in at the Econt office on Poltava 3Zh. We resolve the
    // official office code from Econt's own nomenclature instead of treating this
    // location as a normal street pickup address.
    senderOfficeCity: String(process.env.ECONT_SENDER_OFFICE_CITY || 'Велико Търново').trim(),
    senderOfficeSearch: String(process.env.ECONT_SENDER_OFFICE_SEARCH || 'Полтава 3Ж').trim(),
    senderAgentName: String(process.env.ECONT_SENDER_AGENT_NAME || 'Петър Станиславов Петров').trim(),
  };
}

function flattenEcontError(error) {
  if (!error) return 'Unknown Econt API error.';
  if (typeof error === 'string') return error;

  const messages = [];
  if (error.message) messages.push(error.message);
  if (Array.isArray(error.fields) && error.fields.length) messages.push(error.fields.join(', '));
  if (Array.isArray(error.innerErrors)) {
    for (const inner of error.innerErrors) {
      const message = flattenEcontError(inner);
      if (message) messages.push(message);
    }
  }
  return messages.filter(Boolean).join(': ') || 'Econt API request failed.';
}

export async function econtRequest(method, payload = {}) {
  const config = getEcontConfig();

  if (!config.username || !config.password) {
    throw new Error('Econt credentials are not configured in Vercel.');
  }

  const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');
  const response = await fetch(`${config.baseUrl}/${method.replace(/^\/+/, '')}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Econt returned an unreadable response (${response.status}).`);
  }

  if (!response.ok || data?.type === 'Error') {
    throw new Error(flattenEcontError(data));
  }

  return data;
}

export async function getClientProfiles({ force = false } = {}) {
  const now = Date.now();
  if (!force && profileCache && now - profileCacheAt < PROFILE_CACHE_MS) return profileCache;

  const data = await econtRequest('Profile/ProfileService.getClientProfiles.json', {});
  const profiles = Array.isArray(data?.profiles) ? data.profiles : [];
  if (!profiles.length) throw new Error('Econt returned no client profile for this account.');

  profileCache = profiles;
  profileCacheAt = now;
  return profiles;
}

function compactClient(client = {}) {
  const result = {};
  if (client.id != null) result.id = client.id;
  if (client.name) result.name = client.name;
  if (Array.isArray(client.phones) && client.phones.length) result.phones = client.phones;
  if (client.email) result.email = client.email;
  if (client.clientNumber) result.clientNumber = client.clientNumber;
  return result;
}

function compactSenderAgent(client = {}, overrideName = '') {
  const name = String(overrideName || client.molName || '').trim();
  if (!name) return null;

  const result = { name };
  if (Array.isArray(client.phones) && client.phones.length) result.phones = client.phones;
  if (client.email) result.email = client.email;
  return result;
}

function normalizeBg(value) {
  return String(value || '').trim().toLocaleLowerCase('bg-BG');
}

async function resolveConfiguredSenderOffice(config) {
  if (config.senderOfficeCode) {
    return { code: config.senderOfficeCode, name: null, address: null, source: 'env-code' };
  }

  if (!config.senderOfficeCity || !config.senderOfficeSearch) {
    throw new Error('GERPINA sender Econt office is not configured.');
  }

  const cacheKey = [config.mode, config.senderOfficeCity, config.senderOfficeSearch].join('|');
  const now = Date.now();
  if (senderOfficeCache && senderOfficeCacheKey === cacheKey && now - senderOfficeCacheAt < PROFILE_CACHE_MS) {
    return senderOfficeCache;
  }

  const cityData = await econtRequest('Nomenclatures/NomenclaturesService.getCities.json', { countryCode: 'BGR' });
  const wantedCity = normalizeBg(config.senderOfficeCity);
  const cities = (cityData?.cities || []).filter(
    (city) => normalizeBg(city.name) === wantedCity || normalizeBg(city.nameEn) === wantedCity
  );
  if (!cities.length) throw new Error(`Econt could not find sender city: ${config.senderOfficeCity}.`);

  const city = cities[0];
  const officeData = await econtRequest('Nomenclatures/NomenclaturesService.getOffices.json', {
    countryCode: 'BGR',
    cityID: Number(city.id),
  });

  const normalizeOfficeText = (value) => normalizeBg(value)
    .replace(/№/g, ' ')
    .replace(/[.,;:()\-_/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wantedTokens = normalizeOfficeText(config.senderOfficeSearch).split(' ').filter(Boolean);
  const matches = (officeData?.offices || []).filter((office) => {
    const haystack = normalizeOfficeText([
      office.name,
      office.nameEn,
      office.address?.fullAddress,
      office.address?.fullAddressEn,
      office.address?.street,
      office.address?.num,
    ].filter(Boolean).join(' '));
    return wantedTokens.every((token) => haystack.includes(token));
  });

  if (!matches.length) {
    throw new Error(`Econt could not find the sender office matching “${config.senderOfficeSearch}” in ${config.senderOfficeCity}.`);
  }

  // Prefer a non-APS staffed office when more than one result contains the same address.
  const office = matches.find((candidate) => !candidate.isAPS) || matches[0];
  const result = {
    code: String(office.code),
    name: office.name || office.nameEn || null,
    address: office.address?.fullAddress || office.address?.fullAddressEn || null,
    source: 'econt-office-list',
  };
  senderOfficeCache = result;
  senderOfficeCacheKey = cacheKey;
  senderOfficeCacheAt = now;
  return result;
}

function selectProfile(profiles, config) {
  if (config.preferredClientNumber) {
    const exact = profiles.find((profile) => String(profile?.client?.clientNumber || '') === config.preferredClientNumber);
    if (exact) return exact;
    throw new Error('The configured Econt client number was not found on this account.');
  }

  if (profiles.length === 1) return profiles[0];

  // One e-Econt login can expose several client profiles (for example a private and a
  // company profile). GERPINA already has a known COD agreement, so the safest automatic
  // selector is the profile to which that exact agreement belongs.
  if (config.cdAgreement) {
    const agreementMatches = profiles.filter((profile) => {
      const options = Array.isArray(profile?.cdPayOptions) ? profile.cdPayOptions : [];
      return options.some((option) => String(option?.num || '').trim() === config.cdAgreement);
    });

    if (agreementMatches.length === 1) return agreementMatches[0];

    if (agreementMatches.length > 1) {
      const corporateMatches = agreementMatches.filter((profile) => profile?.client?.juridicalEntity === true);
      if (corporateMatches.length === 1) return corporateMatches[0];
    }
  }

  // If the agreement itself cannot disambiguate, prefer the only legal-entity profile.
  const corporateProfiles = profiles.filter((profile) => profile?.client?.juridicalEntity === true);
  if (corporateProfiles.length === 1) return corporateProfiles[0];

  // A final non-destructive fallback is a single profile with COD payout settings.
  const profilesWithCod = profiles.filter((profile) => Array.isArray(profile?.cdPayOptions) && profile.cdPayOptions.length > 0);
  if (profilesWithCod.length === 1) return profilesWithCod[0];

  // Never guess between several remaining production profiles.
  if (config.isProduction) {
    throw new Error('Several Econt client profiles remain possible. Set ECONT_PROFILE_CLIENT_NUMBER to the GERPINA profile client number.');
  }

  return profiles[0];
}

function selectCdPayOptions(profile, config) {
  if (config.cdPayOptionsTemplate) {
    return { template: config.cdPayOptionsTemplate, options: null, source: 'template' };
  }

  const options = Array.isArray(profile?.cdPayOptions) ? profile.cdPayOptions : [];
  if (!options.length) {
    return { template: null, options: null, source: 'none' };
  }

  // If Econt returns exactly one payout configuration, use the account's own configuration.
  // This keeps IBAN/BIC and payout rules server-side and avoids duplicating them in website env vars.
  if (options.length === 1) {
    return { template: null, options: options[0], source: 'profile' };
  }

  // Some accounts expose an identifying number in the returned COD options. If it matches
  // the configured agreement, prefer that option. Otherwise fail closed in production.
  if (config.cdAgreement) {
    const matching = options.find((option) => String(option?.num || '').trim() === config.cdAgreement);
    if (matching) return { template: null, options: matching, source: 'profile-match' };
  }

  if (config.isProduction) {
    throw new Error('Multiple Econt COD payout options are available. Add ECONT_CD_PAY_TEMPLATE after confirming the correct template in e-Econt.');
  }

  return { template: null, options: options[0], source: 'profile' };
}

export async function resolveAccountSetup() {
  const config = getEcontConfig();
  const profiles = await getClientProfiles();
  const profile = selectProfile(profiles, config);
  const client = compactClient(profile.client);
  const senderIsJuridical = profile?.client?.juridicalEntity === true;
  const senderAgent = senderIsJuridical ? compactSenderAgent(profile.client, config.senderAgentName) : null;

  if (!client.name || !client.phones?.length) {
    throw new Error('The Econt sender profile is missing a name or phone number.');
  }

  // Econt requires an authorised person (senderAgent) when the sender is a legal entity.
  // GERPINA's authorised person can be configured explicitly in Vercel; the phone/email
  // still come from the authenticated company profile and remain server-side.
  if (senderIsJuridical && (!senderAgent?.name || !senderAgent?.phones?.length)) {
    throw new Error('The GERPINA Econt company profile is missing an authorised person or phone number.');
  }

  const senderOffice = await resolveConfiguredSenderOffice(config);
  const senderOfficeCode = senderOffice?.code || null;
  if (!senderOfficeCode) throw new Error('No sender Econt office is configured for GERPINA.');

  const cod = selectCdPayOptions(profile, config);

  return {
    config,
    profile,
    senderClient: client,
    senderAgent,
    senderIsJuridical,
    senderOfficeCode,
    senderOffice,
    senderAddress: null,
    cod,
  };
}

export async function getSafeConnectionStatus() {
  const config = getEcontConfig();
  const base = {
    mode: config.mode,
    production: config.isProduction,
    safeMode: true,
    credentialsConfigured: Boolean(config.username && config.password),
    profileLoaded: false,
    senderReady: false,
    codReady: false,
    agreementConfigured: Boolean(config.cdAgreement),
  };

  if (!base.credentialsConfigured) return base;

  try {
    const setup = await resolveAccountSetup();
    return {
      ...base,
      profileLoaded: true,
      senderReady: Boolean(setup.senderOfficeCode) && (!setup.senderIsJuridical || Boolean(setup.senderAgent?.name && setup.senderAgent?.phones?.length)),
      codReady: Boolean(setup.cod.template || setup.cod.options),
      codSource: setup.cod.source,
      selectedProfileName: setup.senderClient.name || null,
      selectedClientNumber: setup.senderClient.clientNumber || null,
      configuredAgreement: setup.config.cdAgreement || null,
      senderOfficeCode: setup.senderOfficeCode || null,
      senderOfficeName: setup.senderOffice?.name || null,
      senderOfficeAddress: setup.senderOffice?.address || null,
    };
  } catch (error) {
    return { ...base, error: error.message };
  }
}

export function getServerCart(items) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error('The cart is empty.');
  }

  return items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.id);
    if (!product) throw new Error(`Unknown product: ${item.id}`);
    if (product.status !== 'in_stock') throw new Error(`${product.name?.en || product.id} is sold out.`);

    const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, product.stockQuantity || 1));
    return {
      id: product.id,
      quantity,
      price: Number(product.price),
      name: product.name?.bg || product.name?.en || product.id,
      selectedSize: item.selectedSize || null,
    };
  });
}

export function getCartMetrics(items) {
  const cart = getServerCart(items);
  const merchandiseTotal = Number(cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  const unitCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Temporary assumption until real garment weights are available in inventory.
  const shipmentWeightKg = Number(Math.max(0.5, unitCount * 0.5).toFixed(2));

  return { cart, merchandiseTotal, unitCount, shipmentWeightKg };
}

function cleanPhone(phone) {
  return String(phone || '').replace(/[^+\d]/g, '');
}

function buildReceiver(receiver = {}, isProduction = false) {
  const name = String(receiver.name || '').trim();
  const phone = cleanPhone(receiver.phone);

  if (isProduction && (!name || !phone)) {
    throw new Error('Enter the customer name and phone before calculating Econt delivery.');
  }

  return {
    name: name || 'Тестов клиент',
    phones: [phone || '08777777777'],
  };
}

function buildPackingList(cart) {
  return cart.map((item) => ({
    inventoryNum: String(item.id),
    description: `${item.name}${item.selectedSize ? ` · размер ${item.selectedSize}` : ''}`,
    count: item.quantity,
    price: item.price,
  }));
}

export async function buildLabel({ items, deliveryType, city, officeCode, address, receiver }) {
  const setup = await resolveAccountSetup();
  const { config } = setup;
  const { cart, merchandiseTotal, shipmentWeightKg } = getCartMetrics(items);

  if (!city?.id) throw new Error('Please select a city from Econt.');
  if (deliveryType === 'office' && !officeCode) throw new Error('Please select an Econt office.');
  if (deliveryType === 'address' && !String(address || '').trim()) throw new Error('Please enter a delivery address.');

  const services = {
    declaredValueAmount: merchandiseTotal,
    declaredValueCurrency: 'EUR',
    cdAmount: merchandiseTotal,
    cdCurrency: 'EUR',
  };

  if (setup.cod.template) services.cdPayOptionsTemplate = setup.cod.template;
  if (setup.cod.options) services.cdPayOptions = setup.cod.options;

  if (config.isProduction && !services.cdPayOptionsTemplate && !services.cdPayOptions) {
    throw new Error('No COD payout configuration was returned by the Econt account.');
  }

  const label = {
    senderClient: setup.senderClient,
    // For company profiles Econt requires the authorised person separately. This value is
    // taken from the private authenticated profile data and is never returned to the browser.
    ...(setup.senderAgent ? { senderAgent: setup.senderAgent } : {}),
    receiverClient: buildReceiver(receiver, config.isProduction),
    packCount: 1,
    shipmentType: 'pack',
    weight: shipmentWeightKg,
    sizeUnder60cm: true,
    shipmentDescription: `GERPINA Wear clothing (${cart.reduce((sum, item) => sum + item.quantity, 0)} pcs)`,
    services,
    // The agreement for online sales without a cash register requires item-level sales data.
    // We include it already in validation so the future create-mode payload uses the same source of truth.
    payAfterAccept: true,
    payAfterTest: true,
    packingListType: 'digital',
    packingList: buildPackingList(cart),
    // Current business rule: the receiver pays 100% of the courier charge.
    paymentReceiverMethod: 'cash',
    paymentReceiverAmount: 100,
    paymentReceiverAmountIsPercent: true,
  };

  label.senderOfficeCode = setup.senderOfficeCode;

  if (deliveryType === 'office') {
    label.receiverOfficeCode = String(officeCode);
  } else {
    label.receiverAddress = {
      city: {
        id: Number(city.id),
        name: city.name || undefined,
        postCode: city.postCode || undefined,
      },
      fullAddress: String(address).trim(),
    };
  }

  return {
    label,
    merchandiseTotal,
    shipmentWeightKg,
    setupMeta: {
      mode: config.mode,
      safeMode: true,
      codSource: setup.cod.source,
      agreementConfigured: Boolean(config.cdAgreement),
      senderOrigin: 'econt-office',
      senderOfficeCode: setup.senderOfficeCode,
      senderOfficeName: setup.senderOffice?.name || null,
      senderOfficeAddress: setup.senderOffice?.address || null,
    },
  };
}

export function extractQuote(response, merchandiseTotal) {
  const label = response?.label || {};
  const shippingPriceCandidate = label.receiverDueAmount ?? label.totalPrice ?? 0;
  const shippingPrice = Number(Number(shippingPriceCandidate || 0).toFixed(2));
  const currency = label.currency || 'EUR';

  return {
    shippingPrice,
    currency,
    merchandiseTotal,
    payableOnDelivery: Number((merchandiseTotal + shippingPrice).toFixed(2)),
    expectedDeliveryDate: label.expectedDeliveryDate || null,
    warnings: label.warnings || response?.delayedDeliveryWarning || response?.delayedRequestWarning || null,
  };
}
