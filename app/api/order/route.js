import { NextResponse } from 'next/server';
import { createDemoEcontOrder } from '@/lib/econtTestOrder';
import { buildTestOrderEmail, sendTestOrderEmail } from '@/lib/orderEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function makeOrderNumber() {
  const now = new Date();
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GW-T-${stamp}-${suffix}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orderNumber = makeOrderNumber();

    // HARD SAFETY: createDemoEcontOrder is wired only to demo.econt.com with Econt's
    // public developer credentials. This route never imports production create logic.
    const order = await createDemoEcontOrder(body, orderNumber);
    const emailPreview = buildTestOrderEmail({ order, body });
    const email = await sendTestOrderEmail(emailPreview);

    return NextResponse.json({
      ok: true,
      testOnly: true,
      productionShipmentCreated: false,
      demoShipmentCreated: true,
      orderNumber: order.orderNumber,
      shipmentNumber: order.shipmentNumber,
      pdfURL: order.pdfURL,
      expectedDeliveryDate: order.expectedDeliveryDate,
      shippingPrice: order.shippingPrice,
      currency: order.currency,
      merchandiseTotal: order.merchandiseTotal,
      shipmentWeightKg: order.shipmentWeightKg,
      weightNeedsVerification: order.weightNeedsVerification,
      demoFallbacks: order.demoFallbacks,
      payableOnDelivery: Number((order.merchandiseTotal + order.shippingPrice).toFixed(2)),
      senderOffice: order.senderOffice,
      email: {
        ...email,
        preview: {
          subject: emailPreview.subject,
          text: emailPreview.text,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      testOnly: true,
      productionShipmentCreated: false,
      demoShipmentCreated: false,
      error: error.message,
    }, { status: 400 });
  }
}
