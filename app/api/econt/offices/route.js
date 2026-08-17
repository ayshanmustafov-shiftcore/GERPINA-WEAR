import { NextResponse } from 'next/server';
import { econtRequest, getEcontConfig } from '@/lib/econt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = Number(searchParams.get('cityId'));
    if (!Number.isInteger(cityId) || cityId <= 0) {
      return NextResponse.json({ offices: [], error: 'Invalid city ID.' }, { status: 400 });
    }

    const data = await econtRequest('Nomenclatures/NomenclaturesService.getOffices.json', {
      countryCode: 'BGR',
      cityID: cityId,
    });

    const offices = (data?.offices || [])
      .map((office) => ({
        id: office.id,
        code: office.code,
        name: office.name,
        nameEn: office.nameEn,
        address: office.address?.fullAddress || office.address?.fullAddressEn || '',
        isAPS: Boolean(office.isAPS),
        isDrive: Boolean(office.isDrive),
      }))
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'bg'));

    return NextResponse.json({ offices, mode: getEcontConfig().mode });
  } catch (error) {
    return NextResponse.json({ offices: [], error: error.message, mode: getEcontConfig().mode }, { status: 502 });
  }
}
