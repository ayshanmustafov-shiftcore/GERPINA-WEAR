import { NextResponse } from 'next/server';
import { buildLabel, econtRequest, extractQuote, getEcontConfig } from '@/lib/econt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const config = getEcontConfig();
    const { label, merchandiseTotal, shipmentWeightKg } = buildLabel(body);

    // Intentionally NEVER creates a label here. This endpoint is safe for storefront preview/testing.
    const data = await econtRequest('Shipments/LabelService.createLabel.json', {
      mode: 'validate',
      label,
    });

    return NextResponse.json({
      ok: true,
      validated: true,
      shipmentCreated: false,
      mode: config.mode,
      demo: config.mode === 'test',
      shipmentWeightKg,
      ...extractQuote(data, merchandiseTotal),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, validated: false, error: error.message, mode: getEcontConfig().mode }, { status: 400 });
  }
}
