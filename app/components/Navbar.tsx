'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { track } from '@vercel/analytics';
import { Download, Menu, X, Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { TextShimmer } from './TextShimmer';

export default function Navbar() {
    const { language, setLanguage } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    // Detect scroll to trigger detached state
    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 50);
    });

    const content = {
        pt: {
            about: 'Sobre mim',
            stack: 'Stack',
            experience: 'Experiência',
            projects: 'Projetos',
            education: 'Formação',
            downloadCV: 'Baixar currículo',
        },
        en: {
            about: 'About me',
            stack: 'Stack',
            experience: 'Experience',
            projects: 'Projects',
            education: 'Education',
            downloadCV: 'Download resume',
        }
    };

    const t = content[language as 'pt' | 'en'] || content.pt;

    const navItems = [
        { id: 'hero', label: t.about },
        { id: 'stack', label: t.stack },
        { id: 'experience-section', label: t.experience },
        { id: 'projects-section', label: t.projects },
        { id: 'education', label: t.education },
    ];

    const isManualScrolling = useRef(false);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    // Intersection Observer for Active Section Tracking
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isManualScrolling.current) return;
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -80% 0px' }
        );

        navItems.forEach((item) => {
            const section = document.getElementById(item.id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [navItems]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            setActiveSection(id);
            isManualScrolling.current = true;
            document.body.style.pointerEvents = 'none'; // Previne recalculações de hover/intersection pesadas do Tailwind/Framer durante o scroll longo

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

            // Offset for fixed navbar
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });

            // Restore observer check after 1000ms (approx scroll time)
            scrollTimeout.current = setTimeout(() => {
                isManualScrolling.current = false;
                document.body.style.pointerEvents = '';
            }, 1000);
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={cn(
                    'pointer-events-auto fixed top-0 left-0 right-0 z-[60] px-6 md:px-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isScrolled
                        ? 'translate-y-2 md:translate-y-4'
                        : 'translate-y-0 pt-4 md:pt-6'
                )}
            >
                <div
                    className={cn(
                        'flex items-center justify-between mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border',
                        isScrolled
                            ? 'max-w-4xl backdrop-blur-md bg-zinc-900/80 border-zinc-800/80 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
                            : 'max-w-5xl bg-transparent border-transparent rounded-full px-0 sm:px-2 py-2 shadow-none'
                    )}
                >
                    {/* Logo / Brand */}
                    <div className="flex items-center">
                        <button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setActiveSection('');
                            }}
                            className="group flex items-center text-xl font-bold tracking-tighter cursor-pointer"
                        >
                            <span className="text-zinc-500 mr-1 group-hover:text-zinc-400 transition-colors duration-300">&lt;</span>
                            <TextShimmer
                                duration={3}
                                className="[--base-color:#3a7eed] [--base-gradient-color:#7fb0ff] dark:[--base-color:#3a7eed] dark:[--base-gradient-color:#ffffff]"
                            >
                                NVA.
                            </TextShimmer>
                            <span className="text-zinc-500 ml-1 group-hover:text-zinc-400 transition-colors duration-300">/&gt;</span>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 md:gap-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium transition-all rounded-full relative',
                                    activeSection === item.id
                                        ? 'text-white'
                                        : 'text-zinc-400 hover:text-[#dedede]'
                                )}
                            >
                                {activeSection === item.id && (
                                    <motion.div
                                        layoutId="activeSection"
                                        className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <div className="relative grid items-center justify-center overflow-hidden">
                                    <AnimatePresence initial={false}>
                                        <motion.span
                                            key={language + item.label}
                                            initial={{ y: "100%", opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: "-100%", opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="col-start-1 row-start-1 whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </button>
                        ))}
                    </nav>

                    {/* Right Action (Resume) + Mobile Menu Toggle + Language Toggle */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Language Toggle */}
                        <div className="relative flex flex-col items-end">
                            <motion.button
                                layout={true}
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className={cn(
                                    "flex items-center justify-center rounded-full bg-zinc-900 border text-xs font-medium text-zinc-100 hover:text-[#dedede] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group overflow-hidden",
                                    isScrolled
                                        ? "h-9 w-9 px-0 border-transparent bg-zinc-800 hover:bg-zinc-700"
                                        : "px-3 py-2 sm:px-3 sm:py-2 border-zinc-800 hover:bg-zinc-800",
                                    !isScrolled && !isMobile ? "sm:h-auto sm:w-auto" : ""
                                )}
                                transition={{ layout: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 } }}
                            >
                                <motion.div layout="position" className="flex-shrink-0">
                                    <Globe size={16} />
                                </motion.div>

                                <motion.div
                                    layout="position"
                                    className="flex items-center overflow-hidden"
                                    animate={{
                                        width: isScrolled ? 0 : "auto",
                                        opacity: isScrolled ? 0 : 1,
                                        marginLeft: isScrolled ? 0 : 6
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AnimatePresence mode="wait">
                                        {language === 'pt' ? (
                                            <motion.div
                                                key="pt"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center text-xs whitespace-nowrap overflow-hidden pt-0.5"
                                            >
                                                <div className="flex max-w-0 group-hover:max-w-[8px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100 overflow-hidden">
                                                    <span>P</span>
                                                </div>
                                                <div className="flex max-w-[8px] group-hover:max-w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 group-hover:opacity-0 overflow-hidden">
                                                    <span>p</span>
                                                </div>
                                                <div className="flex max-w-0 group-hover:max-w-[16px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100 overflow-hidden">
                                                    <span>or</span>
                                                </div>
                                                <span>t</span>
                                                <div className="flex max-w-0 group-hover:max-w-[40px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100 overflow-hidden">
                                                    <span className="whitespace-pre">uguês </span>
                                                </div>
                                                <div className="flex max-w-[8px] group-hover:max-w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 group-hover:opacity-0 overflow-hidden">
                                                    <span>-</span>
                                                </div>
                                                <span>B</span>
                                                <div className="flex max-w-[8px] group-hover:max-w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 group-hover:opacity-0 overflow-hidden">
                                                    <span>R</span>
                                                </div>
                                                <div className="flex max-w-0 group-hover:max-w-[50px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100 overflow-hidden">
                                                    <span>rasileiro</span>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="en"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center text-xs whitespace-nowrap overflow-hidden pt-[1px]"
                                            >
                                                <div className="flex max-w-0 group-hover:max-w-[8px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100 overflow-hidden">
                                                    <span>E</span>
                                                </div>
                                                <div className="flex max-w-[8px] group-hover:max-w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 group-hover:opacity-0 overflow-hidden">
                                                    <span>e</span>
                                                </div>
                                                <span>n</span>
                                                <div className="flex max-w-0 group-hover:max-w-[36px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100 overflow-hidden">
                                                    <span className="whitespace-pre">glish </span>
                                                </div>
                                                <div className="flex max-w-[8px] group-hover:max-w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 group-hover:opacity-0 overflow-hidden">
                                                    <span>-</span>
                                                </div>
                                                <span>U</span>
                                                <span>S</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.button>

                            {/* Language Dropdown Menu */}
                            <AnimatePresence>
                                {isLangMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-[65]"
                                            onClick={() => setIsLangMenuOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.1 }}
                                            className="absolute top-12 right-0 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl min-w-[200px] flex flex-col z-[70]"
                                        >
                                            <button
                                                onClick={() => {
                                                    setLanguage('pt');
                                                    setIsLangMenuOpen(false);
                                                }}
                                                className={cn("flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-zinc-800 whitespace-nowrap", language === 'pt' ? 'text-[#dedede] bg-zinc-800/50' : 'text-zinc-400')}
                                            >
                                                <span>Português Brasileiro</span>
                                                {language === 'pt' && <Check size={14} className="text-zinc-400" />}
                                            </button>
                                            <div className="h-px bg-[#30363D]" />
                                            <button
                                                onClick={() => {
                                                    setLanguage('en');
                                                    setIsLangMenuOpen(false);
                                                }}
                                                className={cn("flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-zinc-800 whitespace-nowrap", language === 'en' ? 'text-[#dedede] bg-zinc-800/50' : 'text-zinc-400')}
                                            >
                                                <span>English US</span>
                                                {language === 'en' && <Check size={14} className="text-zinc-400" />}
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <a
                            href={language === 'pt' ? '/Nicolas_Viana_Alves_Curriculo.pdf' : '/Nicolas_Viana_Alves_Resume.pdf'}
                            download
                            onClick={() => track('Download CV - Navbar', { language })}
                            className={cn(
                                "hidden sm:flex items-center gap-2 rounded-full font-medium transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border",
                                isScrolled
                                    ? "bg-zinc-800 border-transparent text-sm px-4 py-2 hover:bg-zinc-700 text-[#dedede]"
                                    : "bg-zinc-900 border-zinc-800 text-sm px-5 py-2.5 hover:bg-[#1c2128] text-[#dedede]"
                            )}
                        >
                            <Download size={16} />
                            <div className="relative grid items-center justify-center overflow-hidden">
                                <AnimatePresence initial={false}>
                                    <motion.span
                                        key={language}
                                        initial={{ y: "100%", opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: "-100%", opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="col-start-1 row-start-1 whitespace-nowrap"
                                    >
                                        {t.downloadCV}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </a>

                        {/* Mobile Toggle Handle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 sm:hidden text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 rounded-full"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-[#0e1011]/95 backdrop-blur-xl flex flex-col pt-24 px-6 sm:hidden"
                    >
                        <nav className="flex flex-col gap-6 items-center">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={cn(
                                        'text-xl font-bold tracking-tight transition-colors',
                                        activeSection === item.id ? 'text-white' : 'text-zinc-400 hover:text-white'
                                    )}
                                >
                                    <div className="relative grid items-center justify-center overflow-hidden">
                                        <AnimatePresence initial={false}>
                                            <motion.span
                                                key={language + item.label}
                                                initial={{ y: "100%", opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: "-100%", opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="col-start-1 row-start-1 whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                </button>
                            ))}

                            <div className="h-px w-full max-w-[200px] bg-zinc-800 my-4" />

                            <a
                                href={language === 'pt' ? '/Nicolas_Viana_Alves_Curriculo.pdf' : '/Nicolas_Viana_Alves_Resume.pdf'}
                                download
                                onClick={() => {
                                    track('Download CV - Mobile Nav', { language });
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 w-full max-w-[250px] bg-white text-black rounded-lg px-6 py-4 font-semibold hover:bg-zinc-200 transition-colors"
                            >
                                <Download size={18} />
                                <div className="relative grid items-center justify-center overflow-hidden">
                                    <AnimatePresence initial={false}>
                                        <motion.span
                                            key={language}
                                            initial={{ y: "100%", opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: "-100%", opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="col-start-1 row-start-1 whitespace-nowrap"
                                        >
                                            {t.downloadCV}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
