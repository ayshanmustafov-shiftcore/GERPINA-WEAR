import { products } from '@/data/products';

const DEMO_BASE_URL = 'https://demo.econt.com/ee/services';
const PRODUCTION_BASE_URL = 'https://ee.econt.com/services';
const DEMO_USERNAME = 'iasp-dev';
const DEMO_PASSWORD = '1Asp-dev';

function envFlag(value) {
  return String(value || '').toLowerCase() === 'true';
}

export function getEcontConfig() {
  const mode = process.env.ECONT_ENV === 'production' ? 'production' : 'test';
  const isProduction = mode === 'production';

  return {
    mode,
    isProduction,
    baseUrl: isProduction ? PRODUCTION_BASE_URL : DEMO_BASE_URL,
    username: process.env.ECONT_USERNAME || (isProduction ? '' : DEMO_USERNAME),
    password: process.env.ECONT_PASSWORD || (isProduction ? '' : DEMO_PASSWORD),
    senderName: process.env.ECONT_SENDER_NAME || (isProduction ? '' : 'Алъш-вериш ЕООД'),
    senderPhone: process.env.ECONT_SENDER_PHONE || (isProduction ? '' : '08888888888'),
    senderOfficeCode: process.env.ECONT_SENDER_OFFICE_CODE || (isProduction ? '' : '1000'),
    createLabels: envFlag(process.env.ECONT_CREATE_LABELS),
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
    throw new Error('Econt credentials are not configured.');
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
    signal: AbortSignal.timeout(12000),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Econt returned an unreadable response (${response.status}).`);
  }

  if (!response.ok || data?.type === 'Error' || data?.message) {
    throw new Error(flattenEcontError(data));
  }

  return data;
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
    };
  });
}

export function getCartMetrics(items) {
  const cart = getServerCart(items);
  const merchandiseTotal = Number(cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  const unitCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Temporary demo assumption until garment weights are available in inventory.
  const shipmentWeightKg = Number(Math.max(0.5, unitCount * 0.5).toFixed(2));

  return { cart, merchandiseTotal, unitCount, shipmentWeightKg };
}

function cleanPhone(phone) {
  return String(phone || '').replace(/[^+\d]/g, '') || '08777777777';
}

function buildReceiver(receiver = {}) {
  const name = String(receiver.name || '').trim() || 'Тестов клиент';
  return {
    name,
    phones: [cleanPhone(receiver.phone)],
  };
}

export function buildLabel({ items, deliveryType, city, officeCode, address, receiver }) {
  const config = getEcontConfig();
  const { cart, merchandiseTotal, shipmentWeightKg } = getCartMetrics(items);

  if (!city?.id) throw new Error('Please select a city from Econt.');
  if (deliveryType === 'office' && !officeCode) throw new Error('Please select an Econt office.');
  if (deliveryType === 'address' && !String(address || '').trim()) throw new Error('Please enter a delivery address.');

  const label = {
    senderClient: {
      name: config.senderName,
      phones: [config.senderPhone],
    },
    senderOfficeCode: config.senderOfficeCode,
    receiverClient: buildReceiver(receiver),
    packCount: 1,
    shipmentType: 'pack',
    weight: shipmentWeightKg,
    sizeUnder60cm: true,
    shipmentDescription: `GERPINA Wear clothing (${cart.reduce((sum, item) => sum + item.quantity, 0)} pcs)`,
    services: {
      declaredValueAmount: merchandiseTotal,
      declaredValueCurrency: 'EUR',
      cdAmount: merchandiseTotal,
      cdCurrency: 'EUR',
    },
    // Demo policy: customer pays 100% of the courier fee in cash on receipt.
    paymentReceiverMethod: 'cash',
    paymentReceiverAmountIsPercent: '100',
  };

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

  return { label, merchandiseTotal, shipmentWeightKg };
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
