import { NextResponse } from 'next/server';
import { econtRequest, getEcontConfig } from '@/lib/econt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalize(value) {
  return String(value || '').trim().toLocaleLowerCase('bg-BG');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = normalize(searchParams.get('q'));
    if (q.length < 2) {
      return NextResponse.json({ cities: [], mode: getEcontConfig().mode });
    }

    const data = await econtRequest('Nomenclatures/NomenclaturesService.getCities.json', {
      countryCode: 'BGR',
    });

    const cities = (data?.cities || [])
      .filter((city) => {
        const bg = normalize(city.name);
        const en = String(city.nameEn || '').trim().toLowerCase();
        const region = normalize(city.regionName);
        return bg.includes(q) || en.includes(q.toLowerCase()) || region.includes(q);
      })
      .sort((a, b) => {
        const aStarts = normalize(a.name).startsWith(q) ? 0 : 1;
        const bStarts = normalize(b.name).startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return String(a.name || '').localeCompare(String(b.name || ''), 'bg');
      })
      .slice(0, 25)
      .map((city) => ({
        id: city.id,
        name: city.name,
        nameEn: city.nameEn,
        postCode: city.postCode,
        regionName: city.regionName,
        regionNameEn: city.regionNameEn,
      }));

    return NextResponse.json({ cities, mode: getEcontConfig().mode });
  } catch (error) {
    return NextResponse.json({ cities: [], error: error.message, mode: getEcontConfig().mode }, { status: 502 });
  }
}
