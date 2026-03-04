'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('pt');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem('portfolio-language') as Language;
        if (savedLang) {
            setLanguage(savedLang);
        } else {
            const browserLang = navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
            setLanguage(browserLang);
        }
    }, []);

    const updateLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('portfolio-language', lang);
    };

    const t = (key: string) => {
        // Simple translation helper for now
        return key;
    };

    // We must always wrap children in the provider, even if not mounted yet
    // to avoid the "useLanguage must be used within a LanguageProvider" error
    // IMPORTANT: Never wrap children differently based on `mounted` or it unmounts the entire app on hydration!
    return (
        <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
