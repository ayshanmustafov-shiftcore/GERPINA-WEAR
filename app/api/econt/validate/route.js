import { NextResponse } from 'next/server';
import { buildLabel, econtRequest, extractQuote } from '@/lib/econt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { label, merchandiseTotal, shipmentWeightKg } = await buildLabel(body);
    const data = await econtRequest('Shipments/LabelService.createLabel.json', {
      mode: 'validate',
      label,
    });

    return NextResponse.json({
      ok: true,
      validated: true,
      shipmentCreated: false,
      shipmentWeightKg,
      ...extractQuote(data, merchandiseTotal),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, validated: false, shipmentCreated: false, error: error.message }, { status: 400 });
  }
}
