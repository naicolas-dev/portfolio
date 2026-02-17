import { NextResponse } from 'next/server';
import { getNowPlaying, getRecentlyPlayed } from '@/lib/spotify';

export const revalidate = 0;

export async function GET() {
    try {
        const nowPlaying = await getNowPlaying();

        if (nowPlaying && nowPlaying.isPlaying) {
            return NextResponse.json(nowPlaying);
        }

        const recentlyPlayed = await getRecentlyPlayed();

        if (recentlyPlayed) {
            return NextResponse.json(recentlyPlayed);
        }

        return NextResponse.json({ isPlaying: false }, { status: 200 });
    } catch (error) {
        console.error('Spotify API error:', error);
        return NextResponse.json({ error: 'Failed to fetch Spotify data' }, { status: 500 });
    }
}
