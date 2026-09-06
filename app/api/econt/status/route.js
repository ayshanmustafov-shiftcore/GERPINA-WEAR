import { NextResponse } from 'next/server';
import { getConnectionStatus } from '@/lib/econt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getConnectionStatus();
  // Return only what the storefront needs. Client/profile/agreement details stay server-side.
  return NextResponse.json({
    profileLoaded: Boolean(status.profileLoaded),
    senderReady: Boolean(status.senderReady),
    codReady: Boolean(status.codReady),
    createEnabled: Boolean(status.createEnabled),
    error: status.error || null,
  }, { status: status.error ? 502 : 200 });
}
