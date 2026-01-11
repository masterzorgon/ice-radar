'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '@/translations/en';
import { es } from '@/translations/es';

export type Language = 'en' | 'es';

type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  en,
  es,
};

function getDefaultLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  // Check localStorage first
  const stored = localStorage.getItem('ice-tracker-language');
  if (stored === 'en' || stored === 'es') return stored;

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('es')) return 'es';

  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const defaultLang = getDefaultLanguage();
    setLanguageState(defaultLang);
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ice-tracker-language', lang);
  };

  // Prevent hydration mismatch by not rendering until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
