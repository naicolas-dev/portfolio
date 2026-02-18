'use client';

import { useState } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { SiSpotify, SiSteam } from 'react-icons/si';
import { Book } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MusicSection from './MusicSection';
import GamesSection from './GamesSection';
import BooksSection from './BooksSection';

type Section = 'music' | 'games' | 'books';

export default function PersonalSidebar() {
    const { language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState<Section>('music');

    const sections = [
        { id: 'music' as Section, label: language === 'pt' ? 'Músicas' : 'Songs', icon: SiSpotify, hoverColor: 'hover:text-[#1DB954]' },
        { id: 'games' as Section, label: language === 'pt' ? 'Meus Jogos' : 'My games', icon: SiSteam, hoverColor: 'hover:text-[#00adee]' },
        { id: 'books' as Section, label: language === 'pt' ? 'Livros' : 'Books', icon: Book, hoverColor: 'hover:text-[#eab308]' },
    ];

    const handleSectionClick = (section: Section) => {
        if (activeSection === section && isExpanded) {
            setIsExpanded(false);
        } else {
            setActiveSection(section);
            setIsExpanded(true);
        }
    };

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-50">
                {/* Collapsed State - Tab Buttons */}
                <div
                    className={`flex flex-col gap-2 transition-transform duration-300 group ${isExpanded ? 'translate-x-[320px]' : 'translate-x-0'
                        }`}
                >
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => handleSectionClick(section.id)}
                                className={`flex items-center gap-0 group-hover:gap-2 px-3 py-3 rounded-l-xl transition-all ${isActive && isExpanded
                                    ? 'bg-[#18181b]/95 border-l-2 border-[#1DB954] text-[#1DB954]'
                                    : `bg-[#18181b]/80 border-l-2 border-transparent text-[#A1A6B3] hover:bg-[#18181b] ${section.hoverColor}`
                                    } backdrop-blur-md border-t border-b border-l border-[#2a2d31]`}
                                aria-label={section.label}
                            >
                                <Icon size={22} className="shrink-0" />
                                <span className={`text-xs font-medium whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out`}>
                                    {section.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Expanded State - Content Panel */}
                <div
                    className={`absolute top-1/2 right-0 -translate-y-1/2 h-auto max-h-[85vh] w-80 bg-[#18181b]/95 backdrop-blur-md border-y border-l border-[#2a2d31] rounded-l-2xl shadow-2xl transition-transform duration-300 ${isExpanded ? 'translate-x-0' : 'translate-x-full'
                        } overflow-hidden flex flex-col`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#2a2d31]">
                        {activeSection === 'music' ? (
                            <SiSpotify className="text-[#1DB954]" size={20} />
                        ) : activeSection === 'games' ? (
                            <SiSteam className="text-[#66c0f4]" size={20} />
                        ) : (
                            <Book className="text-[#eab308]" size={20} />
                        )}
                        <h2 className="text-lg font-semibold text-white capitalize">
                            {activeSection === 'music'
                                ? (language === 'pt' ? 'Músicas' : 'Songs')
                                : activeSection === 'games'
                                    ? (language === 'pt' ? 'Jogos' : 'Games')
                                    : (language === 'pt' ? 'Livros' : 'Books')}
                        </h2>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="p-1 hover:bg-[#2a2d31] rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <IoChevronForward className="text-[#A1A6B3]" size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeSection === 'music' ? <MusicSection /> : activeSection === 'games' ? <GamesSection /> : <BooksSection />}
                    </div>
                </div>
            </div>

        </>
    );
}
