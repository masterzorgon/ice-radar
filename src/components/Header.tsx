'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import RadarLogo from './RadarLogo';

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
    <header className="border-b-2 border-accent-dim bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <RadarLogo size={38} />
            <div>
              <h1 className="text-accent text-[10px] tracking-[3px] glow-text">
                {t.header.title}
              </h1>
              <p className="text-accent-dim text-[8px] tracking-wider mt-1">
                {t.header.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-6 text-[8px]">
          {/* Language Toggle - pixel button style */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 border-2 border-accent-dim hover:border-accent hover:bg-accent hover:text-background cursor-pointer"
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
          </button>

          {/* System status indicator */}
          <div className="flex items-center gap-2 border-2 border-accent-dim px-3 py-2">
            <span className="w-2 h-2 bg-accent pixel-pulse" />
            <span className="text-accent-dim tracking-wider">{t.header.systemOnline}</span>
          </div>

          {/* Time display */}
          <div className="text-accent-dim border-2 border-accent-dim px-3 py-2">
            <span className="tracking-wider">UTC:</span>{' '}
            <span className="text-accent glow-text">{time}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
