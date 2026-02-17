const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
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
}

let cached_token: string | null = null;
let token_expiry: number | null = null;

async function getAccessToken() {
    // Return cached token if valid (minus 60s safety buffer)
    if (cached_token && token_expiry && Date.now() < token_expiry - 60000) {
        return { access_token: cached_token };
    }

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
    });

    const data = await response.json();

    if (data.access_token) {
        cached_token = data.access_token;
        // Spotify tokens usually last 3600 seconds (1 hour)
        token_expiry = Date.now() + (data.expires_in || 3600) * 1000;
    }

    return data;
}

export async function getNowPlaying(): Promise<SpotifyTrack | null> {
    const { access_token } = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
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
    };
}

export async function getRecentlyPlayed(): Promise<SpotifyTrack | null> {
    const { access_token } = await getAccessToken();

    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
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
    };
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
    tracks: { total: number };
    external_urls: { spotify: string };
}

const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/me/playlists?limit=10`;

export async function getPublicPlaylists(): Promise<any> {
    const { access_token } = await getAccessToken();

    const response = await fetch(PLAYLISTS_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        next: {
            revalidate: 3600 // Cache for 1 hour
        }
    });

    if (!response.ok) {
        throw new Error(`Spotify Playlists API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();






    if (!data.items) {
        console.error(`[Spotify Debug] No items in response:`, data);
        return { items: [], debug: data };
    }

    const mapped = data.items.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description || '',
        images: playlist.images || [],
        tracks: { total: playlist.tracks?.total || 0 },
        external_urls: playlist.external_urls || { spotify: '' },
    }));

    return { items: mapped, debug: data };
}
