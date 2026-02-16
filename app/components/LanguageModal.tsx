'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface LanguageModalProps {
    onSelect: (lang: 'pt' | 'en') => void;
}

export function LanguageModal({ onSelect }: LanguageModalProps) {
    const [hoveredLang, setHoveredLang] = useState<'pt' | 'en' | null>(null);

    // Determine the title based on hover state
    const titleText = hoveredLang === 'en' ? "Select your language" : "Selecione seu idioma";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0F1115]"
        >
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">

                {/* Animated Title */}
                <div className="h-24 md:h-32 flex items-center justify-center mb-16">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={titleText}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="text-4xl md:text-5xl font-bold text-white tracking-tight text-center"
                        >
                            {titleText}
                        </motion.h2>
                    </AnimatePresence>
                </div>

                <div className="flex flex-col md:flex-row items-stretch gap-6 w-full max-w-2xl px-4">

                    {/* Portuguese Link */}
                    <button
                        onClick={() => onSelect('pt')}
                        onMouseEnter={() => setHoveredLang('pt')}
                        onMouseLeave={() => setHoveredLang(null)}
                        className="group relative flex-1 p-8 rounded-2xl border border-[#30363D] bg-[#161B22] hover:bg-[#161B22]/80 transition-all duration-300 flex flex-col items-center justify-center gap-6 hover:border-zinc-600 active:scale-[0.98]"
                    >
                        {/* Brazil Flag SVG Colored */}
                        <div className="w-24 h-16 relative shadow-lg rounded-md overflow-hidden group-hover:scale-105 transition-transform duration-500 flex items-center justify-center bg-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 50" className="w-full h-full object-cover">
                                <rect width="72" height="50" fill="#009c3b" />
                                <polygon points="36,6 66,25 36,44 6,25" fill="#ffdf00" />
                                <circle cx="36" cy="25" r="10.5" fill="#002776" />
                                <path d="M28,28 C30,26 36,22 44,24" fill="none" stroke="#fff" strokeWidth="1.5" />
                            </svg>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xl font-semibold text-zinc-100 tracking-tight">Português</span>
                            <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">Brasil</span>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <ArrowRight size={20} className="text-zinc-400" />
                        </div>
                    </button>

                    {/* English Link */}
                    <button
                        onClick={() => onSelect('en')}
                        onMouseEnter={() => setHoveredLang('en')}
                        onMouseLeave={() => setHoveredLang(null)}
                        className="group relative flex-1 p-8 rounded-2xl border border-[#30363D] bg-[#161B22] hover:bg-[#161B22]/80 transition-all duration-300 flex flex-col items-center justify-center gap-6 hover:border-zinc-600 active:scale-[0.98]"
                    >
                        {/* USA Flag SVG Colored */}
                        <div className="w-24 h-16 relative shadow-lg rounded-md overflow-hidden group-hover:scale-105 transition-transform duration-500 flex items-center justify-center bg-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 741 390" className="w-full h-full object-cover">
                                <rect width="741" height="390" fill="#b22234" />
                                <path d="M0,30h741v30H0zM0,90h741v30H0zM0,150h741v30H0zM0,210h741v30H0zM0,270h741v30H0zM0,330h741v30H0z" fill="#fff" />
                                <rect width="296.4" height="210" fill="#3c3b6e" />
                                {/* Simplified stars pattern for small size UI clarity */}
                                <g fill="#fff">
                                    <circle cx="30" cy="25" r="10" /> <circle cx="85" cy="25" r="10" /> <circle cx="140" cy="25" r="10" /> <circle cx="195" cy="25" r="10" /> <circle cx="250" cy="25" r="10" />
                                    <circle cx="55" cy="55" r="10" /> <circle cx="110" cy="55" r="10" /> <circle cx="165" cy="55" r="10" /> <circle cx="220" cy="55" r="10" />
                                    <circle cx="30" cy="85" r="10" /> <circle cx="85" cy="85" r="10" /> <circle cx="140" cy="85" r="10" /> <circle cx="195" cy="85" r="10" /> <circle cx="250" cy="85" r="10" />
                                    <circle cx="55" cy="115" r="10" /> <circle cx="110" cy="115" r="10" /> <circle cx="165" cy="115" r="10" /> <circle cx="220" cy="115" r="10" />
                                    <circle cx="30" cy="145" r="10" /> <circle cx="85" cy="145" r="10" /> <circle cx="140" cy="145" r="10" /> <circle cx="195" cy="145" r="10" /> <circle cx="250" cy="145" r="10" />
                                    <circle cx="55" cy="175" r="10" /> <circle cx="110" cy="175" r="10" /> <circle cx="165" cy="175" r="10" /> <circle cx="220" cy="175" r="10" />
                                </g>
                            </svg>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xl font-semibold text-zinc-100 tracking-tight">English</span>
                            <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">United States</span>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <ArrowRight size={20} className="text-zinc-400" />
                        </div>
                    </button>

                </div>
            </div>
        </motion.div>
    );
}