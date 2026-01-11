'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import RadarLogo from './RadarLogo';
import Button from '@/components/ui/Button';

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
    <header className="border-b-2 border-accent-dim bg-background px-3 sm:px-4 py-2 sm:py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="shrink-0">
              <div className="block sm:hidden">
                <RadarLogo size={28} />
              </div>
              <div className="hidden sm:block">
                <RadarLogo size={38} />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-accent text-[8px] sm:text-[10px] tracking-[2px] sm:tracking-[3px] glow-text truncate">
                {t.header.title}
              </h1>
              <p className="text-accent-muted text-[6px] sm:text-[8px] tracking-wider mt-0.5 sm:mt-1 hidden xs:block">
                {t.header.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[8px] shrink-0">
          {/* Language Toggle - pixel button style */}
          <Button
            onClick={toggleLanguage}
            variant="secondary"
            className="min-h-[44px] gap-1 sm:gap-2"
            title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Ingles'}
          >
            <Image
              src={language === 'en' ? '/flag-us.svg' : '/flag-mx.svg'}
              alt={language === 'en' ? 'English' : 'Espanol'}
              width={16}
              height={12}
              className="pixelated"
            />
            <span className="tracking-wider">{language === 'en' ? 'EN' : 'ES'}</span>
          </Button>

          {/* System status indicator - hidden on smallest screens */}
          <div className="hidden sm:flex items-center gap-2 border-2 border-accent-dim px-2 sm:px-3 py-2 min-h-[44px]">
            <span className="w-2 h-2 bg-accent pixel-pulse" />
            <span className="text-accent-muted tracking-wider hidden md:inline">{t.header.systemOnline}</span>
            <span className="text-accent-muted tracking-wider md:hidden">ON</span>
          </div>

          {/* Time display - hidden on mobile */}
          <div className="hidden md:block text-accent-muted border-2 border-accent-dim px-3 py-2 min-h-[44px]">
            <span className="tracking-wider">UTC:</span>{' '}
            <span className="text-accent glow-text">{time}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
