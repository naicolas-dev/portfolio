import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/spotify';

export const runtime = 'edge';

export async function GET() {
    const profile = await getUserProfile();

    if (profile) {
        return NextResponse.json(profile);
    }

    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
}
