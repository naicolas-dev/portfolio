import { NextResponse } from 'next/server';
import { getPublicPlaylists } from '@/lib/spotify';

export const runtime = 'edge';

export async function GET() {
    const playlists = await getPublicPlaylists();

    // getPublicPlaylists now returns { items: [] } on error, so we can just return it
    if (playlists.items.length === 0) {
        // We can optionally check if it's an error based on returned structure or just return empty
        // For now, returning strictly what the frontend expects is safest.
        // Frontend expects: { items: [...] } or error object?
        // Let's check MusicSection.tsx:
        // const data = await res.json();
        // setPlaylists(data.items || []);
        // So returning { items: [] } is perfect.
    }

    return NextResponse.json(playlists);
}
