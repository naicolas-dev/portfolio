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
    progress_ms: number;
    duration_ms: number;
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
        progress_ms: song.progress_ms,
        duration_ms: song.item.duration_ms,
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
        progress_ms: 0,
        duration_ms: track.duration_ms,
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

let cached_playlists: any = null;
let playlists_fetched_at: number = 0;

export async function getPublicPlaylists(): Promise<any> {
    // Return cached playlists if valid (less than 1 hour old)
    if (cached_playlists && Date.now() - playlists_fetched_at < 3600 * 1000) {
        return cached_playlists;
    }

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
        // If rate limited or error, try to return stale cache
        if (cached_playlists) {
            console.warn(`Spotify API error completely failed: ${response.status}. Returning stale cache.`);
            return cached_playlists;
        }
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

    const result = { items: mapped, debug: data };

    // Update cache
    cached_playlists = result;
    playlists_fetched_at = Date.now();

    return result;
}

export interface SpotifyProfile {
    display_name: string;
    external_urls: { spotify: string };
    images: { url: string }[];
    followers: { total: number };
}

const PROFILE_ENDPOINT = `https://api.spotify.com/v1/me`;

let cached_profile: SpotifyProfile | null = null;
let profile_fetched_at: number = 0;

export async function getUserProfile(): Promise<SpotifyProfile | null> {
    // Return cached profile if valid (less than 24 hours old - profile rarely changes)
    if (cached_profile && Date.now() - profile_fetched_at < 24 * 3600 * 1000) {
        return cached_profile;
    }

    const { access_token } = await getAccessToken();

    const response = await fetch(PROFILE_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        next: {
            revalidate: 86400 // Cache for 24 hours
        }
    });

    if (!response.ok) {
        console.error(`Spotify Profile API error: ${response.status}`);
        // Return stale cache if available
        if (cached_profile) return cached_profile;
        return null; // Don't throw, just return null so UI handles it gracefully
    }

    const data = await response.json();

    const profile: SpotifyProfile = {
        display_name: data.display_name,
        external_urls: data.external_urls,
        images: data.images || [],
        followers: data.followers || { total: 0 },
    };

    cached_profile = profile;
    profile_fetched_at = Date.now();

    return profile;
}
