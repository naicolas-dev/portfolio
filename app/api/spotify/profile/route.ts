import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/spotify';

export const revalidate = 3600; // Cache on edge for 1 hour

export async function GET() {
    try {
        const profile = await getUserProfile();

        if (profile) {
            return NextResponse.json(profile);
        }

        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    } catch (error) {
        console.error('Spotify Profile API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
