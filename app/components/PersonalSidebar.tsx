'use client';

import { useState } from 'react';
import { IoMusicalNotes, IoGameController, IoChevronForward } from 'react-icons/io5';
import { useLanguage } from '../context/LanguageContext';
import MusicSection from './MusicSection';
import GamesSection from './GamesSection';

type Section = 'music' | 'games';

export default function PersonalSidebar() {
    const { language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState<Section>('music');

    const sections = [
        { id: 'music' as Section, label: language === 'pt' ? 'Músicas' : 'Songs', icon: IoMusicalNotes },
        { id: 'games' as Section, label: language === 'pt' ? 'Meus Jogos' : 'My games', icon: IoGameController },
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
                    className={`flex flex-col gap-2 transition-transform duration-300 ${isExpanded ? 'translate-x-[320px]' : 'translate-x-0'
                        }`}
                >
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => handleSectionClick(section.id)}
                                className={`group flex items-center gap-2 px-3 py-3 rounded-l-xl transition-all ${isActive && isExpanded
                                    ? 'bg-[#1a1d21]/95 border-l-2 border-[#1DB954] text-[#1DB954]'
                                    : 'bg-[#1a1d21]/80 border-l-2 border-transparent text-[#A1A6B3] hover:bg-[#1a1d21] hover:text-white'
                                    } backdrop-blur-md border-t border-b border-l border-[#2a2d31]`}
                                aria-label={section.label}
                            >
                                <Icon size={20} />
                                <span className="text-xs font-medium whitespace-nowrap">{section.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Expanded State - Content Panel */}
                <div
                    className={`absolute top-0 right-0 h-[80vh] w-80 bg-[#1a1d21]/95 backdrop-blur-md border-l border-[#2a2d31] rounded-l-2xl shadow-2xl transition-transform duration-300 ${isExpanded ? 'translate-x-0' : 'translate-x-full'
                        } overflow-hidden flex flex-col`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#2a2d31]">
                        <h2 className="text-lg font-semibold text-white capitalize">
                            {activeSection === 'music'
                                ? (language === 'pt' ? 'Músicas' : 'Music')
                                : (language === 'pt' ? 'Jogos' : 'Games')}
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
                        {activeSection === 'music' ? <MusicSection /> : <GamesSection />}
                    </div>
                </div>
            </div>

            {/* Mobile View - Bottom Drawer */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                {/* Collapsed State - Tab Bar */}
                {!isExpanded && (
                    <div className="flex gap-2 p-3 bg-[#1a1d21]/95 backdrop-blur-md border-t border-[#2a2d31]">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionClick(section.id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1a1d21]/80 border border-[#2a2d31] text-[#A1A6B3] hover:bg-[#1a1d21] hover:text-white transition-all"
                                >
                                    <Icon size={20} />
                                    <span className="text-sm font-medium">{section.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Expanded State - Drawer */}
                {isExpanded && (
                    <div className="bg-[#1a1d21]/95 backdrop-blur-md border-t border-[#2a2d31] max-h-[70vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#2a2d31]">
                            <div className="flex gap-3">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    const isActive = activeSection === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                                                ? 'bg-[#2a2d31] text-[#1DB954]'
                                                : 'text-[#A1A6B3] hover:bg-[#2a2d31]/50 hover:text-white'
                                                }`}
                                        >
                                            <Icon size={18} />
                                            <span className="text-sm font-medium">{section.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-2 hover:bg-[#2a2d31] rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <IoChevronForward className="text-[#A1A6B3] rotate-90" size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto">
                            {activeSection === 'music' ? <MusicSection /> : <GamesSection />}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
