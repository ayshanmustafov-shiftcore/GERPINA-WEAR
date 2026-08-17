import { NextResponse } from 'next/server';
import { buildLabel, econtRequest, extractQuote, getEcontConfig } from '@/lib/econt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { label, merchandiseTotal, shipmentWeightKg } = buildLabel(body);
    const data = await econtRequest('Shipments/LabelService.createLabel.json', {
      mode: 'calculate',
      label,
    });

    return NextResponse.json({
      ok: true,
      mode: getEcontConfig().mode,
      demo: getEcontConfig().mode === 'test',
      shipmentWeightKg,
      ...extractQuote(data, merchandiseTotal),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message, mode: getEcontConfig().mode }, { status: 400 });
  }
}
