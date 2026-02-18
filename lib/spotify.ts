const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = btoa(`${client_id}:${client_secret}`);
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;

export interface SpotifyTrack {
    isPlaying: boolean;
    title: string;
    artist: string;
    album: string;
    albumImageUrl: string;
    songUrl: string;
    progress_ms: number;
    duration_ms: number;
}

async function getAccessToken() {
    try {
        const response = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refresh_token!,
            }),
            next: {
                revalidate: 3300 // Cache token for 55 minutes (expires in 60m)
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Spotify Debug] Token fetch failed: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`Token fetch failed: ${response.status} ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error('[Spotify Debug] Error fetching access token:', error);
        throw error;
    }
}

export async function getNowPlaying(): Promise<SpotifyTrack | null> {
    const { access_token } = await getAccessToken().catch(() => ({ access_token: null }));

    if (!access_token) return null;

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        cache: 'no-store' // Real-time data, do not cache
    });

    if (response.status === 204 || response.status > 400) {
        return null;
    }

    const song = await response.json();

    if (!song.item) {
        return null;
    }

    return {
        isPlaying: song.is_playing,
        title: song.item.name,
        artist: song.item.artists.map((artist: any) => artist.name).join(', '),
        album: song.item.album.name,
        albumImageUrl: song.item.album.images[0]?.url || '',
        songUrl: song.item.external_urls.spotify,
        progress_ms: song.progress_ms,
        duration_ms: song.item.duration_ms,
    };
}

export async function getRecentlyPlayed(): Promise<SpotifyTrack | null> {
    const { access_token } = await getAccessToken().catch(() => ({ access_token: null }));

    if (!access_token) return null;

    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        next: {
            revalidate: 600 // Cache for 10 minutes to avoid spamming
        }
    });

    if (response.status > 400) {
        return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        return null;
    }

    const track = data.items[0].track;

    return {
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        album: track.album.name,
        albumImageUrl: track.album.images[0]?.url || '',
        songUrl: track.external_urls.spotify,
        progress_ms: 0,
        duration_ms: track.duration_ms,
    };
}
