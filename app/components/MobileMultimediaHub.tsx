'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiSpotify, SiSteam } from 'react-icons/si';
import { IoClose } from 'react-icons/io5';
import { Book } from 'lucide-react';
import MusicSection from './MusicSection';
import GamesSection from './GamesSection';
import BooksSection from './BooksSection';
import { useLanguage } from '../context/LanguageContext';

export default function MobileMultimediaHub() {
    const { language } = useLanguage();
    const [activeModal, setActiveModal] = useState<'music' | 'games' | 'books' | null>(null);

    const closeModal = () => setActiveModal(null);

    // Prevent body scroll when modal is open
    if (typeof window !== 'undefined') {
        if (activeModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-wrap items-center justify-center gap-4 mt-6 md:hidden w-full max-w-full"
            >
                <button
                    onClick={() => setActiveModal('music')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181b] border border-[#27272a] text-[#A1A6B3] hover:text-[#1DB954] hover:border-[#1DB954]/50 transition-all"
                >
                    <SiSpotify size={18} />
                    <span className="text-xs font-medium">{language === 'pt' ? 'Músicas' : 'Songs'}</span>
                </button>
                <div className="w-px h-4 bg-[#27272a]"></div>
                <button
                    onClick={() => setActiveModal('games')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181b] border border-[#27272a] text-[#A1A6B3] hover:text-[#66c0f4] hover:border-[#66c0f4]/50 transition-all"
                >
                    <SiSteam size={18} />
                    <span className="text-xs font-medium">{language === 'pt' ? 'Jogos' : 'Games'}</span>
                </button>
                <div className="w-px h-4 bg-[#27272a]"></div>
                <button
                    onClick={() => setActiveModal('books')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181b] border border-[#27272a] text-[#A1A6B3] hover:text-[#eab308] hover:border-[#eab308]/50 transition-all"
                >
                    <Book size={18} />
                    <span className="text-xs font-medium">{language === 'pt' ? 'Livros' : 'Books'}</span>
                </button>
            </motion.div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full sm:w-[90%] max-w-md bg-[#18181b] border-t sm:border border-[#27272a] sm:rounded-xl shadow-2xl flex flex-col max-h-[85vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
                                <div className="flex items-center gap-2">
                                    {activeModal === 'music' ? (
                                        <>
                                            <SiSpotify className="text-[#1DB954]" size={20} />
                                            <h3 className="text-white font-medium">{language === 'pt' ? 'Músicas' : 'Songs'}</h3>
                                        </>
                                    ) : activeModal === 'games' ? (
                                        <>
                                            <SiSteam className="text-[#66c0f4]" size={20} />
                                            <h3 className="text-white font-medium">{language === 'pt' ? 'Jogos' : 'Games'}</h3>
                                        </>
                                    ) : (
                                        <>
                                            <Book className="text-[#eab308]" size={20} />
                                            <h3 className="text-white font-medium">{language === 'pt' ? 'Livros' : 'Books'}</h3>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 text-[#A1A6B3] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                                >
                                    <IoClose size={24} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-0">
                                {activeModal === 'music' ? <MusicSection /> : activeModal === 'games' ? <GamesSection /> : <BooksSection />}
                            </div>
                        </motion.div>

                        {/* Backdrop Click to Close */}
                        <div className="absolute inset-0 -z-10" onClick={closeModal}></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
