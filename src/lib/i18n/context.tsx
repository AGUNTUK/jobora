'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, getTranslation } from './translations';

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
    isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [language, setLanguageState] = useState<Language>('en');
    const [isRTL, setIsRTL] = useState(false);

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('jobora-language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
            setLanguageState(savedLang);
        }
    }, []);

    // Update RTL state when language changes
    useEffect(() => {
        setIsRTL(language === 'bn');
        document.documentElement.lang = language;
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }, [language, isRTL]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('jobora-language', lang);
    };

    // Translation function
    const t = (path: string): string => {
        return getTranslation(language, path);
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>
            {children}
        </I18nContext.Provider>
    );
}

// Custom hook to use i18n
export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

// Language selector component
export function LanguageSelector() {
    const { language, setLanguage } = useI18n();

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === 'en'
                        ? 'bg-primary-500 text-white'
                        : 'bg-skeu-cream text-skeu-brown hover:bg-primary-100'
                    }`}
            >
                English
            </button>
            <button
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === 'bn'
                        ? 'bg-primary-500 text-white'
                        : 'bg-skeu-cream text-skeu-brown hover:bg-primary-100'
                    }`}
            >
                বাংলা
            </button>
        </div>
    );
}

// Export translations for direct access
export { translations };
export type { Language };
