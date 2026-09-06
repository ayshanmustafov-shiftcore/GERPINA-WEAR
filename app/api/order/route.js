import { NextResponse } from 'next/server';
import { createProductionEcontOrder } from '@/lib/econtOrder';
import { getServerCart } from '@/lib/econt';
import { buildOrderEmail, sendOrderEmail } from '@/lib/orderEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function makeOrderNumber() {
  const now = new Date();
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GW-${stamp}-${suffix}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orderNumber = makeOrderNumber();
    const cart = getServerCart(body.items);
    const order = await createProductionEcontOrder(body, orderNumber);
    const emailContent = buildOrderEmail({ order, body, cart });
    const email = await sendOrderEmail(emailContent);

    return NextResponse.json({
      ok: true,
      productionShipmentCreated: true,
      orderNumber: order.orderNumber,
      shipmentNumber: order.shipmentNumber,
      pdfURL: order.pdfURL,
      expectedDeliveryDate: order.expectedDeliveryDate,
      shippingPrice: order.shippingPrice,
      currency: order.currency,
      merchandiseTotal: order.merchandiseTotal,
      payableOnDelivery: order.payableOnDelivery,
      shipmentWeightKg: order.shipmentWeightKg,
      weightNeedsVerification: order.weightNeedsVerification,
      emailSent: Boolean(email.sent),
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      productionShipmentCreated: false,
      error: error.message,
    }, { status: 400 });
  }
}
