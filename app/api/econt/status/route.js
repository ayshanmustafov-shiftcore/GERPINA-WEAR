import { NextResponse } from 'next/server';
import { getSafeConnectionStatus } from '@/lib/econt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getSafeConnectionStatus();
  return NextResponse.json(status, { status: status.error ? 502 : 200 });
}
