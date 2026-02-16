'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { TextShimmer } from './TextShimmer';

interface LanguageModalProps {
    onSelect: (lang: 'pt' | 'en') => void;
}

const TEXTS = {
    pt: {
        title: "Selecione seu idioma",
        typewriter: "Olá, bem-vindo(a) ao meu portfólio!",
        label: "Português",
        sub: "Brasil"
    },
    en: {
        title: "Select your language",
        typewriter: "Hi, welcome to my portfolio!",
        label: "English",
        sub: "United States"
    }
};

export function LanguageModal({ onSelect }: LanguageModalProps) {
    const [activeLang, setActiveLang] = useState<'pt' | 'en'>('pt');
    const [isHovering, setIsHovering] = useState(false);
    const [showShimmer, setShowShimmer] = useState(false);

    // Auto-cycle logic
    useEffect(() => {
        if (isHovering) return;

        const interval = setInterval(() => {
            setShowShimmer(false); // Reset shimmer on auto-cycle
            setActiveLang(prev => prev === 'pt' ? 'en' : 'pt');
        }, 7500);

        return () => clearInterval(interval);
    }, [isHovering]);

    const handleMouseEnter = (lang: 'pt' | 'en') => {
        if (lang !== activeLang) setShowShimmer(false); // Reset shimmer on manual change
        setIsHovering(true);
        setActiveLang(lang);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0e1011]"
        >
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col items-center gap-4 mb-10 h-32 justify-end">

                    {/* Primary Animated Text (Typewriter/Drawing Effect) */}
                    <div className="relative flex items-center justify-center overflow-hidden h-16">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeLang}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {showShimmer ? (
                                    <TextShimmer
                                        className='text-4xl md:text-5xl font-bold tracking-tight text-center [--base-color:#3B82F6] [--base-gradient-color:#93C5FD] dark:[--base-color:#3B82F6] dark:[--base-gradient-color:#93C5FD]'
                                        duration={2.5}
                                    >
                                        {TEXTS[activeLang].typewriter}
                                    </TextShimmer>
                                ) : (
                                    <TypewriterText
                                        text={TEXTS[activeLang].typewriter}
                                        onComplete={() => setShowShimmer(true)}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Secondary Title (Select Language) */}
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeLang}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="text-lg text-zinc-500 font-medium"
                        >
                            {TEXTS[activeLang].title}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Cards Container */}
                <div className="flex flex-col md:flex-row items-stretch gap-6 w-full max-w-2xl px-4">

                    {/* Portuguese Card */}
                    <LanguageCard
                        lang="pt"
                        isActive={isHovering && activeLang === 'pt'}
                        onSelect={() => onSelect('pt')}
                        onHover={() => handleMouseEnter('pt')}
                        onLeave={handleMouseLeave}
                        Content={
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xl font-semibold text-zinc-100 tracking-tight">Português</span>
                                <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">Brasil</span>
                            </div>
                        }
                        Flag={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 50" className="w-full h-full object-cover">
                                <rect width="72" height="50" fill="#009c3b" />
                                <polygon points="36,6 66,25 36,44 6,25" fill="#ffdf00" />
                                <circle cx="36" cy="25" r="10.5" fill="#002776" />
                                <path d="M28,28 C30,26 36,22 44,24" fill="none" stroke="#fff" strokeWidth="1.5" />
                            </svg>
                        }
                    />

                    {/* English Card */}
                    <LanguageCard
                        lang="en"
                        isActive={isHovering && activeLang === 'en'}
                        onSelect={() => onSelect('en')}
                        onHover={() => handleMouseEnter('en')}
                        onLeave={handleMouseLeave}
                        Content={
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xl font-semibold text-zinc-100 tracking-tight">English</span>
                                <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">United States</span>
                            </div>
                        }
                        Flag={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 741 390" className="w-full h-full object-cover">
                                <rect width="741" height="390" fill="#b22234" />
                                <path d="M0,30h741v30H0zM0,90h741v30H0zM0,150h741v30H0zM0,210h741v30H0zM0,270h741v30H0zM0,330h741v30H0z" fill="#fff" />
                                <rect width="296.4" height="210" fill="#3c3b6e" />
                                <g fill="#fff">
                                    <circle cx="30" cy="25" r="10" /> <circle cx="85" cy="25" r="10" /> <circle cx="140" cy="25" r="10" /> <circle cx="195" cy="25" r="10" /> <circle cx="250" cy="25" r="10" />
                                    <circle cx="55" cy="55" r="10" /> <circle cx="110" cy="55" r="10" /> <circle cx="165" cy="55" r="10" /> <circle cx="220" cy="55" r="10" />
                                    <circle cx="30" cy="85" r="10" /> <circle cx="85" cy="85" r="10" /> <circle cx="140" cy="85" r="10" /> <circle cx="195" cy="85" r="10" /> <circle cx="250" cy="85" r="10" />
                                    <circle cx="55" cy="115" r="10" /> <circle cx="110" cy="115" r="10" /> <circle cx="165" cy="115" r="10" /> <circle cx="220" cy="115" r="10" />
                                    <circle cx="30" cy="145" r="10" /> <circle cx="85" cy="145" r="10" /> <circle cx="140" cy="145" r="10" /> <circle cx="195" cy="145" r="10" /> <circle cx="250" cy="145" r="10" />
                                    <circle cx="55" cy="175" r="10" /> <circle cx="110" cy="175" r="10" /> <circle cx="165" cy="175" r="10" /> <circle cx="220" cy="175" r="10" />
                                </g>
                            </svg>
                        }
                    />

                </div>
            </div >
        </motion.div >
    );
}

// Sub-components for cleaner code

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
    const characters = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.03,
                delayChildren: 0.2
            }
        }
    };

    const child = {
        hidden: {
            opacity: 0,
            y: 10,
            filter: "blur(8px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.4,
                ease: "easeOut" as const
            }
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => onComplete?.()}
            className="flex flex-wrap justify-center text-4xl md:text-5xl font-bold tracking-tight text-center text-[#3B82F6]"
        >
            {characters.map((char, index) => (
                <motion.span variants={child} key={index} className="inline-block">
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    );
}



function LanguageCard({ lang, isActive, onSelect, onHover, onLeave, Content, Flag }: any) {
    return (
        <button
            onClick={onSelect}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className={`
                group relative flex-1 p-8 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-6 active:scale-[0.98]
                ${isActive
                    ? 'bg-zinc-800/80 border-zinc-600 scale-[1.02] shadow-[0_0_30px_rgba(0,0,0,0.3)]'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }
            `}
        >
            <div className={`
                w-24 h-16 relative shadow-lg rounded-md overflow-hidden transition-transform duration-500 flex items-center justify-center bg-zinc-800
                ${isActive ? 'scale-110' : 'group-hover:scale-105'}
            `}>
                {Flag}
            </div>

            {Content}

            {/* Hover indicator */}
            <div className={`
                absolute top-6 right-6 transition-all duration-300 transform
                ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
            `}>
                <ArrowRight size={20} className="text-zinc-400" />
            </div>
        </button>
    );
}