'use client';

import { SiSteam } from 'react-icons/si';
import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';

interface SteamData {
    profile: {
        name: string;
        avatar: string;
        status: number;
        game: string | null;
    } | null;
    currentlyPlaying: {
        name: string;
        appid: number;
        playtime_forever: number;
        icon_url: string | null;
        platform: string;
    } | null;
    perfectedGames: {
        name: string;
        appid: number;
        icon: string;
    }[];
}

const statusMap: Record<number, { label: string, color: string }> = {
    0: { label: 'Offline', color: 'bg-zinc-500' },
    1: { label: 'Online', color: 'bg-blue-400' },
    2: { label: 'Busy', color: 'bg-red-500' },
    3: { label: 'Away', color: 'bg-yellow-500' },
    4: { label: 'Snooze', color: 'bg-blue-400' },
};

export default function GamesSection() {
    const { language } = useLanguage();
    const [steamData, setSteamData] = useState<SteamData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await fetch('/api/steam');
                if (res.ok) {
                    const data = await res.json();
                    setSteamData(data);
                }
            } catch (error) {
                console.error('Error fetching games:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const formatPlaytime = (minutes: number) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        return `${hours}h`;
    };

    if (loading) {
        return <div className="text-center text-[#A1A6B3] text-sm py-8">{language === 'pt' ? 'Carregando...' : 'Loading...'}</div>;
    }

    if (!steamData) {
        return <p className="text-sm text-[#A1A6B3] text-center py-8">{language === 'pt' ? 'Nenhum dado encontrado' : 'No data found'}</p>;
    }

    const { profile, currentlyPlaying, perfectedGames } = steamData;

    // Determine status display
    let statusLabel = statusMap[profile?.status || 0]?.label || 'Offline';
    let statusColor = statusMap[profile?.status || 0]?.color || 'bg-zinc-500';
    let statusTextClass = 'text-[#A1A6B3]';

    if (profile?.game) {
        statusLabel = language === 'pt' ? `Jogando ${profile.game}` : `Playing ${profile.game}`;
        statusColor = 'bg-[#1DB954]'; // Spotify/Steam Green for playing
        statusTextClass = 'text-[#1DB954] font-medium';
    }

    return (
        <div className="flex flex-col gap-5 p-4">
            {/* Profile Header */}
            {profile && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1d21]/30 border border-[#2a2d31]/50 mb-1">
                    <div className="relative">
                        <img src={profile.avatar} alt={profile.name} className="w-12 h-12 rounded-lg object-cover" />
                        <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#1a1d21] ${statusColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{profile.name}</h4>
                        <p className={`text-[10px] uppercase tracking-tighter truncate ${statusTextClass}`}>
                            {statusLabel}
                        </p>
                    </div>
                </div>
            )}

            {/* Currently Playing (Only 1) */}
            <div>
                <h3 className="text-[10px] uppercase tracking-widest text-[#A1A6B3]/60 mb-2 px-1 font-bold">
                    {language === 'pt' ? 'Jogando agora' : 'Currently Playing'}
                </h3>
                {currentlyPlaying ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1d21]/50 border border-[#2a2d31] hover:bg-[#1a1d21] transition-colors group">
                        {currentlyPlaying.icon_url ? (
                            <img src={currentlyPlaying.icon_url} alt={currentlyPlaying.name} className="w-8 h-8 rounded shrink-0 shadow-sm" />
                        ) : (
                            <SiSteam className="text-[#A1A6B3] flex-shrink-0" size={24} />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white line-clamp-1">{currentlyPlaying.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-[#A1A6B3] mt-0.5">
                                <span>Steam</span>
                                {currentlyPlaying.playtime_forever > 0 && (
                                    <>
                                        <span>•</span>
                                        <span>{formatPlaytime(currentlyPlaying.playtime_forever)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-[#A1A6B3] px-1 italic">
                        {language === 'pt' ? 'Nada no momento...' : 'Nothing right now...'}
                    </p>
                )}
            </div>

            {/* Perfected Games (100% trophies) */}
            <div>
                <h3 className="text-[10px] uppercase tracking-widest text-[#A1A6B3]/60 mb-2 px-1 font-bold">
                    {language === 'pt' ? 'Meus 100%' : 'My Perfect Games'}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {perfectedGames.map((game, index) => (
                        <div key={index}
                            className="flex items-center gap-2 p-2 rounded-lg bg-[#1a1d21]/40 border border-[#2a2d31]/30 hover:bg-[#1a1d21]/60 transition-all hover:scale-[1.02] group"
                            title={game.name}
                        >
                            <img src={game.icon} alt={game.name} className="w-8 h-8 rounded shrink-0 shadow-sm opacity-90 group-hover:opacity-100" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-white/80 leading-tight line-clamp-2 group-hover:text-white">
                                    {game.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
