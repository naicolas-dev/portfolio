const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/me/playlists?limit=10`;
const PROFILE_ENDPOINT = `https://api.spotify.com/v1/me`;

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

export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
    tracks: { total: number };
    external_urls: { spotify: string };
}

export interface SpotifyProfile {
    display_name: string;
    external_urls: { spotify: string };
    images: { url: string }[];
    followers: { total: number };
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

        return response.json();
    } catch (error) {
        console.error('Error fetching access token:', error);
        return { access_token: null };
    }
}

export async function getNowPlaying(): Promise<SpotifyTrack | null> {
    const { access_token } = await getAccessToken();

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
    const { access_token } = await getAccessToken();

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

export async function getPublicPlaylists() {
    const { access_token } = await getAccessToken();

    if (!access_token) return { items: [] };

    const response = await fetch(PLAYLISTS_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        next: {
            revalidate: 3600 // Cache for 1 hour
        }
    });

    if (!response.ok) {
        console.error(`Spotify Playlists API error: ${response.status} ${response.statusText}`);
        return { items: [] };
    }

    const data = await response.json();

    if (!data.items) {
        return { items: [] };
    }

    const mapped = data.items.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description || '',
        images: playlist.images || [],
        tracks: { total: playlist.tracks?.total || 0 },
        external_urls: playlist.external_urls || { spotify: '' },
    }));

    return { items: mapped };
}

export async function getUserProfile(): Promise<SpotifyProfile | null> {
    const { access_token } = await getAccessToken();

    if (!access_token) return null;

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
        return null;
    }

    const data = await response.json();

    return {
        display_name: data.display_name,
        external_urls: data.external_urls,
        images: data.images || [],
        followers: data.followers || { total: 0 },
    };
}
