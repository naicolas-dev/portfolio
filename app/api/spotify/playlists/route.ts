import { NextResponse } from 'next/server';
import { getPublicPlaylists } from '@/lib/spotify';



export async function GET() {
    try {
        const playlists = await getPublicPlaylists();
        return NextResponse.json(playlists);
    } catch (error: any) {
        console.error('Spotify Playlists API error:', error);

        // Extract status code from error message if possible (e.g. "Spotify Playlists API error: 429 Too Many Requests")
        const statusMatch = error.message?.match(/(\d{3})/);
        const status = statusMatch ? parseInt(statusMatch[0]) : 500;

        return NextResponse.json({
            error: 'Failed to fetch playlists',
            details: error.message || error
        }, { status });
    }
}
