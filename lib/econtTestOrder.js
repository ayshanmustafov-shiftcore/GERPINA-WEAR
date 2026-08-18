import { getCartMetrics } from '@/lib/econt';

const DEMO_BASE_URL = 'https://demo.econt.com/ee/services';
const DEMO_USERNAME = 'iasp-dev';
const DEMO_PASSWORD = '1Asp-dev';
const SENDER_CITY = 'Велико Търново';
const SENDER_OFFICE_SEARCH = 'Полтава 3Ж';

function flattenEcontError(error) {
  if (!error) return 'Unknown Econt DEMO API error.';
  if (typeof error === 'string') return error;
  const messages = [];
  if (error.message) messages.push(error.message);
  if (Array.isArray(error.fields) && error.fields.length) messages.push(error.fields.join(', '));
  if (Array.isArray(error.innerErrors)) {
    for (const inner of error.innerErrors) messages.push(flattenEcontError(inner));
  }
  return messages.filter(Boolean).join(': ') || 'Econt DEMO API request failed.';
}

async function demoRequest(method, payload = {}) {
  const auth = Buffer.from(`${DEMO_USERNAME}:${DEMO_PASSWORD}`).toString('base64');
  const response = await fetch(`${DEMO_BASE_URL}/${method.replace(/^\/+/, '')}`, {
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
    throw new Error(`Econt DEMO returned an unreadable response (${response.status}).`);
  }
  if (!response.ok || data?.type === 'Error') throw new Error(flattenEcontError(data));
  return data;
}

function norm(value) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('bg-BG')
    .replace(/№/g, ' ')
    .replace(/[.,;:()\-_/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function resolveDemoCity(cityName) {
  const data = await demoRequest('Nomenclatures/NomenclaturesService.getCities.json', { countryCode: 'BGR' });
  const wanted = norm(cityName);
  const city = (data?.cities || []).find((candidate) => norm(candidate.name) === wanted || norm(candidate.nameEn) === wanted);
  if (!city) throw new Error(`Econt DEMO could not find city “${cityName}”.`);
  return city;
}

async function resolveDemoSenderOffice() {
  const city = await resolveDemoCity(SENDER_CITY);
  const data = await demoRequest('Nomenclatures/NomenclaturesService.getOffices.json', {
    countryCode: 'BGR',
    cityID: Number(city.id),
  });
  const tokens = norm(SENDER_OFFICE_SEARCH).split(' ').filter(Boolean);
  const matches = (data?.offices || []).filter((office) => {
    const text = norm([
      office.name,
      office.nameEn,
      office.address?.fullAddress,
      office.address?.fullAddressEn,
      office.address?.street,
      office.address?.num,
    ].filter(Boolean).join(' '));
    return tokens.every((token) => text.includes(token));
  });
  const exactOffice = matches.find((candidate) => !candidate.isAPS) || matches[0];
  const allOffices = data?.offices || [];
  const fallbackOffice = allOffices.find((candidate) => !candidate.isAPS) || allOffices[0];
  const office = exactOffice || fallbackOffice;
  if (!office) throw new Error('Econt DEMO returned no usable sender office in Велико Търново.');
  return {
    code: String(office.code),
    name: office.name || office.nameEn || '',
    address: office.address?.fullAddress || office.address?.fullAddressEn || '',
    fallbackUsed: !exactOffice,
    requestedOffice: `${SENDER_CITY}, ${SENDER_OFFICE_SEARCH}`,
  };
}

async function resolveDemoProfile() {
  const data = await demoRequest('Profile/ProfileService.getClientProfiles.json', {});
  const profiles = Array.isArray(data?.profiles) ? data.profiles : [];
  if (!profiles.length) throw new Error('Econt DEMO returned no sender profile.');

  const profile = profiles.find((item) => item?.client?.juridicalEntity === true) || profiles[0];
  const client = profile?.client || {};
  if (!client.name || !Array.isArray(client.phones) || !client.phones.length) {
    throw new Error('Econt DEMO sender profile is incomplete.');
  }

  const senderClient = {
    ...(client.id != null ? { id: client.id } : {}),
    name: client.name,
    phones: client.phones,
    ...(client.email ? { email: client.email } : {}),
    ...(client.clientNumber ? { clientNumber: client.clientNumber } : {}),
  };

  let senderAgent = null;
  if (client.juridicalEntity === true) {
    const agentName = String(client.molName || 'Тестов представител').trim();
    senderAgent = {
      name: agentName,
      phones: client.phones,
      ...(client.email ? { email: client.email } : {}),
    };
  }

  const codOptions = Array.isArray(profile.cdPayOptions) ? profile.cdPayOptions : [];
  return { senderClient, senderAgent, codOptions };
}

function cleanPhone(phone) {
  return String(phone || '').replace(/[^+\d]/g, '');
}

function buildPackingList(cart) {
  return cart.map((item) => ({
    inventoryNum: String(item.id),
    description: `${item.name}${item.selectedSize ? ` · размер ${item.selectedSize}` : ''}`,
    count: item.quantity,
    price: item.price,
  }));
}

async function resolveReceiverDestination(body) {
  const demoCity = await resolveDemoCity(body?.city?.name || body?.city?.nameEn || '');

  if (body.deliveryType === 'office') {
    const data = await demoRequest('Nomenclatures/NomenclaturesService.getOffices.json', {
      countryCode: 'BGR',
      cityID: Number(demoCity.id),
    });
    const offices = data?.offices || [];
    const requestedCode = String(body.officeCode || '');
    let office = offices.find((candidate) => String(candidate.code) === requestedCode);

    if (!office && body.office) {
      const wanted = norm([body.office.name, body.office.address].filter(Boolean).join(' '));
      office = offices.find((candidate) => {
        const candidateText = norm([
          candidate.name,
          candidate.nameEn,
          candidate.address?.fullAddress,
          candidate.address?.fullAddressEn,
        ].filter(Boolean).join(' '));
        return wanted && (candidateText.includes(wanted) || wanted.includes(candidateText));
      });
    }
    const exactOffice = office;
    if (!office) office = offices.find((candidate) => !candidate.isAPS) || offices[0];
    if (!office) throw new Error('Econt DEMO returned no usable receiver office for the selected city.');
    return {
      receiverOfficeCode: String(office.code),
      demoCity,
      receiverOffice: {
        code: String(office.code),
        name: office.name || office.nameEn || '',
        address: office.address?.fullAddress || office.address?.fullAddressEn || '',
      },
      receiverOfficeFallbackUsed: !exactOffice,
    };
  }

  if (!String(body.address || '').trim()) throw new Error('Enter a delivery address.');
  return {
    receiverAddress: {
      city: { id: Number(demoCity.id), name: demoCity.name, postCode: demoCity.postCode },
      fullAddress: String(body.address).trim(),
    },
    demoCity,
  };
}

export async function createDemoEcontOrder(body, orderNumber) {
  // HARD SAFETY BOUNDARY: this module has no production URL and no production credentials.
  // Even when ECONT_ENV=production in Vercel, order creation here can only reach Econt DEMO.
  const { cart, merchandiseTotal, shipmentWeightKg } = getCartMetrics(body.items);
  const { senderClient, senderAgent, codOptions } = await resolveDemoProfile();
  const senderOffice = await resolveDemoSenderOffice();
  const destination = await resolveReceiverDestination(body);

  const receiverName = String(body?.receiver?.name || '').trim();
  const receiverPhone = cleanPhone(body?.receiver?.phone);
  if (!receiverName || receiverPhone.length < 7) throw new Error('Enter a valid customer name and phone number.');

  const services = {
    declaredValueAmount: merchandiseTotal,
    declaredValueCurrency: 'EUR',
    cdAmount: merchandiseTotal,
    cdCurrency: 'EUR',
  };
  if (codOptions.length) services.cdPayOptions = codOptions[0];

  const label = {
    senderClient,
    ...(senderAgent ? { senderAgent } : {}),
    senderOfficeCode: senderOffice.code,
    receiverClient: {
      name: receiverName,
      phones: [receiverPhone],
      ...(body?.receiver?.email ? { email: String(body.receiver.email).trim() } : {}),
    },
    ...(destination.receiverOfficeCode ? { receiverOfficeCode: destination.receiverOfficeCode } : {}),
    ...(destination.receiverAddress ? { receiverAddress: destination.receiverAddress } : {}),
    packCount: 1,
    shipmentType: 'pack',
    weight: shipmentWeightKg,
    sizeUnder60cm: true,
    shipmentDescription: `[TEST] GERPINA Wear clothing (${cart.reduce((sum, item) => sum + item.quantity, 0)} pcs)`,
    orderNumber,
    services,
    payAfterAccept: true,
    payAfterTest: true,
    packingListType: 'digital',
    packingList: buildPackingList(cart),
    paymentReceiverMethod: 'cash',
    paymentReceiverAmount: 100,
    paymentReceiverAmountIsPercent: true,
  };

  const response = await demoRequest('Shipments/LabelService.createLabel.json', {
    mode: 'create',
    label,
  });

  const created = response?.label || {};
  if (!created.shipmentNumber) {
    throw new Error('Econt DEMO did not return a shipment number after create.');
  }

  return {
    environment: 'demo',
    orderNumber,
    shipmentNumber: String(created.shipmentNumber),
    pdfURL: created.pdfURL || null,
    expectedDeliveryDate: created.expectedDeliveryDate || null,
    shippingPrice: Number(Number(created.receiverDueAmount ?? created.totalPrice ?? 0).toFixed(2)),
    currency: created.currency || 'EUR',
    merchandiseTotal,
    shipmentWeightKg,
    weightNeedsVerification: true,
    senderOffice,
    receiverOffice: destination.receiverOffice || null,
    demoFallbacks: {
      senderOffice: Boolean(senderOffice.fallbackUsed),
      receiverOffice: Boolean(destination.receiverOfficeFallbackUsed),
    },
    cart,
  };
}
