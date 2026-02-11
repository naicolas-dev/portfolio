'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';

export function LocationIndicator({ language = 'pt' }: { language?: 'pt' | 'en' }) {
    const [time, setTime] = useState<string>('');
    const [showTime, setShowTime] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const locale = language === 'pt' ? 'pt-BR' : 'en-US';
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'America/Sao_Paulo',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: language === 'en'
            };
            setTime(now.toLocaleTimeString(locale, options));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [language]);

    // 6-second auto-toggle, paused on hover
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setShowTime(prev => !prev);
        }, 6000);
        return () => clearInterval(interval);
    }, [isHovered]);

    const actuallyShowingTime = isHovered ? !showTime : showTime;

    return (
        <div
            className="relative flex items-center justify-center mb-8 cursor-default"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden h-8 px-5 rounded-full bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-all duration-500 ease-out shadow-sm flex items-center justify-center min-w-[200px]">

                {/* Location View */}
                <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${actuallyShowingTime ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                    }`}>
                    <MapPin size={14} className="text-zinc-500" />
                    <span className="text-zinc-400 text-xs font-medium tracking-wide whitespace-nowrap">
                        Montes Claros, MG, {language === 'pt' ? 'Brasil' : 'Brazil'}
                    </span>
                </div>

                {/* Time View */}
                <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${actuallyShowingTime ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                    }`}>
                    <Clock size={14} className="text-zinc-500" />
                    <span className="text-zinc-200 text-xs font-mono font-medium tracking-wider whitespace-nowrap">
                        {time} <span className="text-zinc-600 ml-1">GMT-3</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
