import { NextResponse } from 'next/server';
import { buildLabel, econtRequest, extractQuote, getEcontConfig } from '@/lib/econt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const config = getEcontConfig();
    const { label, merchandiseTotal, shipmentWeightKg, setupMeta } = await buildLabel(body);

    // SAFE PRODUCTION BUILD: this route is hardcoded to validate.
    // There is no create-label API route anywhere in this project.
    const data = await econtRequest('Shipments/LabelService.createLabel.json', {
      mode: 'validate',
      label,
    });

    return NextResponse.json({
      ok: true,
      validated: true,
      shipmentCreated: false,
      mode: config.mode,
      safeMode: true,
      shipmentWeightKg,
      setup: setupMeta,
      ...extractQuote(data, merchandiseTotal),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, validated: false, shipmentCreated: false, error: error.message, mode: getEcontConfig().mode, safeMode: true }, { status: 400 });
  }
}
