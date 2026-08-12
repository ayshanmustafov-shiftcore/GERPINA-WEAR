import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({ ok: false, message: 'Ordering is not enabled yet.' }, { status: 503 }); }
