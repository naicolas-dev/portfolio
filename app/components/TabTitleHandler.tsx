'use client';

import { useEffect } from 'react';

export function TabTitleHandler({ language }: { language: 'pt' | 'en' }) {
    useEffect(() => {
        const originalTitle = document.title;
        const blurTitle = language === 'pt' ? "Ei, volta aqui! 😭" : "Hey, come back! 😭";

        const handleBlur = () => {
            document.title = blurTitle;
        };

        const handleFocus = () => {
            document.title = originalTitle;
        };

        // Update title immediately if we are already blurred and language changes
        if (document.hidden) {
            document.title = blurTitle;
        } else {
            document.title = originalTitle;
        }

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.title = originalTitle;
        };
    }, [language]);

    return null;
}
