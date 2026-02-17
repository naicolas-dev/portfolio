'use client';

import { useEffect, useState } from 'react';
import { SiSpotify } from 'react-icons/si';

interface SpotifyData {
    isPlaying: boolean;
    title?: string;
    artist?: string;
    album?: string;
    albumImageUrl?: string;
    songUrl?: string;
}

export default function SpotifySidebar() {
    const [data, setData] = useState<SpotifyData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSpotify = async () => {
        try {
            const res = await fetch('/api/spotify');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpotify();
        const interval = setInterval(fetchSpotify, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    // Show placeholder when no data (credentials not configured)
    const showPlaceholder = !loading && (!data || !data.title);

    if (loading) {
        return null; // Don't render anything while loading
    }

    if (showPlaceholder) {
        return (
            <>
                {/* Desktop: Fixed vertical sidebar - Placeholder */}
                <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-4 w-64 bg-[#1a1d21]/80 backdrop-blur-md border border-[#2a2d31] rounded-2xl p-4 shadow-2xl z-50">
                    <div className="flex items-center gap-2 w-full">
                        <SiSpotify className="text-[#1DB954]" size={20} />
                        <span className="text-xs text-[#A1A6B3] uppercase tracking-wider">
                            Spotify
                        </span>
                    </div>
                    <div className="w-full aspect-square rounded-lg bg-[#2a2d31] flex items-center justify-center text-center text-sm text-[#A1A6B3] p-4">
                        Credentials not configured.
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <p className="text-sm font-semibold text-white line-clamp-2">Not Playing</p>
                        <p className="text-xs text-[#A1A6B3] line-clamp-1">No data available</p>
                    </div>
                </div>

                {/* Mobile: Floating bottom bar - Placeholder */}
                <div className="md:hidden fixed bottom-4 left-4 right-4 bg-[#1a1d21]/95 backdrop-blur-md border border-[#2a2d31] rounded-xl p-3 shadow-2xl z-50 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-[#2a2d31] flex items-center justify-center text-xs text-[#A1A6B3]">
                        N/A
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white line-clamp-1 block">Not Playing</p>
                        <p className="text-xs text-[#A1A6B3] line-clamp-1">No data available</p>
                    </div>
                    <SiSpotify className="text-[#1DB954] flex-shrink-0" size={24} />
                </div>
            </>
        );
    }

    // TypeScript guard: at this point data exists and has title
    if (!data || !data.title) {
        return null;
    }

    return (
        <>
            {/* Desktop: Fixed vertical sidebar */}
            <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-4 w-64 bg-[#1a1d21]/80 backdrop-blur-md border border-[#2a2d31] rounded-2xl p-4 shadow-2xl z-50">
                <div className="flex items-center gap-2 w-full">
                    <SiSpotify className={`text-[#1DB954] ${data.isPlaying ? 'animate-pulse' : ''}`} size={20} />
                    <span className="text-xs text-[#A1A6B3] uppercase tracking-wider">
                        {data.isPlaying ? 'Now Playing' : 'Recently Played'}
                    </span>
                </div>

                {data.albumImageUrl && (
                    <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                        <img
                            src={data.albumImageUrl}
                            alt={data.album}
                            className="w-full aspect-square rounded-lg object-cover shadow-lg hover:scale-105 transition-transform"
                        />
                    </a>
                )}

                <div className="w-full flex flex-col gap-1">
                    <a
                        href={data.songUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-white hover:text-[#1DB954] transition-colors line-clamp-2"
                    >
                        {data.title}
                    </a>
                    <p className="text-xs text-[#A1A6B3] line-clamp-1">{data.artist}</p>
                </div>

                {data.isPlaying && (
                    <div className="flex items-end justify-center gap-1 h-8 w-full">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-[#1DB954] rounded-full animate-sound-wave"
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    height: '50%',
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile: Floating bottom bar */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 bg-[#1a1d21]/95 backdrop-blur-md border border-[#2a2d31] rounded-xl p-3 shadow-2xl z-50 flex items-center gap-3">
                {data.albumImageUrl && (
                    <a href={data.songUrl} target="_blank" rel="noopener noreferrer">
                        <img
                            src={data.albumImageUrl}
                            alt={data.album}
                            className="w-12 h-12 rounded-md object-cover shadow-md"
                        />
                    </a>
                )}

                <div className="flex-1 min-w-0">
                    <a
                        href={data.songUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-white hover:text-[#1DB954] transition-colors line-clamp-1 block"
                    >
                        {data.title}
                    </a>
                    <p className="text-xs text-[#A1A6B3] line-clamp-1">{data.artist}</p>
                </div>

                <SiSpotify className={`text-[#1DB954] flex-shrink-0 ${data.isPlaying ? 'animate-pulse' : ''}`} size={24} />
            </div>
        </>
    );
}
