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

export default function MusicSection() {
    const { language } = useLanguage();
    const [nowPlaying, setNowPlaying] = useState<SpotifyData | null>(null);
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

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await fetchNowPlaying();
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

    if (!nowPlaying?.title) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-[#1a1d21]/50 rounded-xl border border-[#2a2d31]">
                <SiSpotify className="text-[#A1A6B3] mb-2" size={32} />
                <p className="text-sm text-[#A1A6B3]">
                    {language === 'pt' ? 'Nada tocando no momento' : 'Nothing playing right now'}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Now Playing Card */}
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
        </div>
    );
}
