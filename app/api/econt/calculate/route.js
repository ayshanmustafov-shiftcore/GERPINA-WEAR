import { NextResponse } from 'next/server';
import { buildLabel, econtRequest, extractQuote, getEcontConfig } from '@/lib/econt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { label, merchandiseTotal, shipmentWeightKg, setupMeta } = await buildLabel(body);
    const data = await econtRequest('Shipments/LabelService.createLabel.json', {
      mode: 'calculate',
      label,
    });

    return NextResponse.json({
      ok: true,
      mode: getEcontConfig().mode,
      safeMode: true,
      shipmentCreated: false,
      shipmentWeightKg,
      setup: setupMeta,
      ...extractQuote(data, merchandiseTotal),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message, mode: getEcontConfig().mode, safeMode: true }, { status: 400 });
  }
}
