'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [time, setTime] = useState<string>('');
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <header className="border-b border-accent-dim/30 bg-black/80 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-accent text-lg font-bold tracking-wider">
                {t.header.title}
              </h1>
              <p className="text-accent-dim text-xs">
                {t.header.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-2 py-1 border border-accent-dim/30 hover:border-accent/50 transition-colors cursor-pointer"
            title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Ingles'}
          >
            <Image
              src={language === 'en' ? '/flag-us.svg' : '/flag-mx.svg'}
              alt={language === 'en' ? 'English' : 'Espanol'}
              width={20}
              height={15}
              className="rounded-sm"
            />
            <span className="text-accent-dim uppercase">{language === 'en' ? 'EN' : 'ES'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent-dim">{t.header.systemOnline}</span>
          </div>
          <div className="text-accent-dim w-22">
            UTC: <span className="text-accent">{time}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
