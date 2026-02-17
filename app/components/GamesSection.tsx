'use client';

import { games, type Game } from '@/data/games';
import { SiSteam, SiPlaystation, SiNintendoswitch } from 'react-icons/si';
import { FaDesktop, FaMobileAlt, FaXbox } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const platformIcons: Record<Game['platform'], React.ComponentType<{ className?: string; size?: number }>> = {
    Steam: SiSteam,
    PlayStation: SiPlaystation,
    Xbox: FaXbox,
    Nintendo: SiNintendoswitch,
    PC: FaDesktop,
    Mobile: FaMobileAlt,
};

const statusColors = {
    playing: 'text-[#1DB954]',
    completed: 'text-[#4a9eff]',
    paused: 'text-[#A1A6B3]',
};

export default function GamesSection() {
    const { language } = useLanguage();

    return (
        <div className="flex flex-col gap-3 p-4">
            <h3 className="text-xs uppercase tracking-wider text-[#A1A6B3] mb-1 px-1">
                {language === 'pt' ? 'Jogando agora' : 'Currently Playing'}
            </h3>

            {games.length === 0 ? (
                <p className="text-sm text-[#A1A6B3] text-center py-8">
                    {language === 'pt' ? 'Nenhum jogo ainda!' : 'No games yet!'}
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {games.map((game, index) => {
                        const Icon = platformIcons[game.platform];
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1d21]/50 border border-[#2a2d31] hover:bg-[#1a1d21] transition-colors"
                            >
                                <Icon className="text-[#A1A6B3] flex-shrink-0" size={24} />

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white line-clamp-1">{game.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-[#A1A6B3] mt-0.5">
                                        <span>{game.platform}</span>
                                        {game.playtime && (
                                            <>
                                                <span>•</span>
                                                <span>{game.playtime}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {game.status && (
                                    <span className={`text-xs font-medium ${statusColors[game.status]} capitalize`}>
                                        {game.status}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
