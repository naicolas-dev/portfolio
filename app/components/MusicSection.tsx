'use client';

import { useEffect, useState } from 'react';
import { SiSpotify } from 'react-icons/si';
import { useLanguage } from '../context/LanguageContext';

interface SpotifyData {
    isPlaying: boolean;
    title?: string;
    artist?: string;
    album?: string;
    albumImageUrl?: string;
    songUrl?: string;
    progress_ms?: number;
    duration_ms?: number;
}

interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
    tracks: { total: number };
    external_urls: { spotify: string };
}

interface SpotifyProfile {
    display_name: string;
    external_urls: { spotify: string };
    images: { url: string }[];
    followers: { total: number };
}

export default function MusicSection() {
    const { language } = useLanguage();
    const [nowPlaying, setNowPlaying] = useState<SpotifyData | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [profile, setProfile] = useState<SpotifyProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const fetchNowPlaying = async () => {
        try {
            const res = await fetch('/api/spotify');
            if (res.ok) {
                const data = await res.json();
                setNowPlaying(data);
                if (data.progress_ms) {
                    setProgress(data.progress_ms);
                }
            } else {
                console.error('Now Playing Request Failed:', res.status);
            }
        } catch (error) {
            console.error('Error fetching Now Playing:', error);
        }
    };

    const fetchPlaylists = async () => {
        try {
            const res = await fetch('/api/spotify/playlists');
            if (res.ok) {
                const data = await res.json();
                console.log('Playlists Full Debug Data:', data.debug);
                console.log('Playlists Mapped Items:', data.items);
                setPlaylists(data.items || []);
            } else {
                console.error('Playlists Request Failed:', res.status);
            }
        } catch (error) {
            console.error('Error fetching Playlists:', error);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/spotify/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching Profile:', error);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchNowPlaying(), fetchPlaylists(), fetchProfile()]);
            setLoading(false);
        };
        init();

        const interval = setInterval(fetchNowPlaying, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (nowPlaying?.isPlaying && nowPlaying?.duration_ms && nowPlaying?.progress_ms) {
            const timeRemaining = nowPlaying.duration_ms - nowPlaying.progress_ms;

            // If the song is about to end (within a reasonable buffer), schedule a fetch
            if (timeRemaining > 0) {
                const timeout = setTimeout(() => {
                    fetchNowPlaying();
                }, timeRemaining + 1000); // Fetch 1s after expected end
                return () => clearTimeout(timeout);
            }
        }
    }, [nowPlaying?.duration_ms, nowPlaying?.progress_ms, nowPlaying?.isPlaying]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (nowPlaying?.isPlaying && nowPlaying.duration_ms) {
            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= (nowPlaying.duration_ms || 0)) {
                        return prev;
                    }
                    return prev + 1000;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [nowPlaying]);

    if (loading) {
        return <div className="text-center text-[#A1A6B3] text-sm py-4">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Profile Header */}
            {profile && (
                <div className="flex items-center gap-3 mb-2">
                    {profile.images[0] && (
                        <img
                            src={profile.images[0].url}
                            alt={profile.display_name}
                            className="w-10 h-10 rounded-full border-2 border-[#1DB954]"
                        />
                    )}
                    <div>
                        <a
                            href={profile.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-semibold hover:text-[#1DB954] transition-colors"
                        >
                            {profile.display_name}
                        </a>
                        <div className="flex items-center gap-1 text-xs text-[#A1A6B3]">
                            <SiSpotify size={12} />
                            <span>Spotify</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Now Playing Card */}
            {nowPlaying && nowPlaying.title && (
                <div className="bg-[#1a1d21]/80 border border-[#2a2d31] rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                        {nowPlaying.isPlaying ? (
                            <div className="flex items-end gap-[2px] h-4 w-4 justify-center pb-1">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-[2px] bg-[#1DB954] rounded-full animate-sound-wave"
                                        style={{
                                            animationDelay: `${i * 0.15}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <SiSpotify className="text-[#1DB954]" size={16} />
                        )}
                        <span className="text-xs text-[#A1A6B3] uppercase tracking-wider">
                            {nowPlaying.isPlaying
                                ? (language === 'pt' ? 'Estou ouvindo agora' : "I'm now playing")
                                : (language === 'pt' ? 'Ouvi recentemente' : "I've listened recently")}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        {nowPlaying.albumImageUrl && (
                            <a href={nowPlaying.songUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={nowPlaying.albumImageUrl}
                                    alt={nowPlaying.album}
                                    className="w-16 h-16 rounded-lg object-cover shadow-md hover:scale-105 transition-transform"
                                />
                            </a>
                        )}

                        <div className="flex-1 min-w-0">
                            <a
                                href={nowPlaying.songUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-white hover:text-[#1DB954] transition-colors line-clamp-1 block"
                            >
                                {nowPlaying.title}
                            </a>
                            <p className="text-xs text-[#A1A6B3] line-clamp-1">{nowPlaying.artist}</p>
                        </div>
                    </div>

                    {nowPlaying.isPlaying && nowPlaying.duration_ms && (
                        <div className="mt-3">
                            <div className="w-full bg-[#2a2d31] rounded-full h-1 mb-1">
                                <div
                                    className="bg-[#1DB954] h-1 rounded-full transition-all duration-1000 ease-linear"
                                    style={{ width: `${Math.min((progress / nowPlaying.duration_ms) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-[#A1A6B3] font-mono">
                                <span>{formatTime(progress)}</span>
                                <span>{formatTime(nowPlaying.duration_ms)}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Playlists */}
            {playlists.length > 0 && (
                <div>
                    <h3 className="text-xs uppercase tracking-wider text-[#A1A6B3] mb-2 px-1">{language === 'pt' ? 'Minhas Playlists' : 'My Playlists'}</h3>
                    <div className="flex flex-col gap-2">
                        {playlists.map((playlist) => (
                            <a
                                key={playlist.id}
                                href={playlist.external_urls.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1d21]/50 transition-colors group"
                            >
                                {playlist.images[0] && (
                                    <img
                                        src={playlist.images[0].url}
                                        alt={playlist.name}
                                        className="w-12 h-12 rounded-md object-cover shadow-sm group-hover:scale-105 transition-transform"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white group-hover:text-[#1DB954] transition-colors line-clamp-1">
                                        {playlist.name}
                                    </p>
                                    <p className="text-xs text-[#A1A6B3]">{playlist.tracks.total} tracks</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
